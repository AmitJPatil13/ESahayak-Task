import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { 
  BuyerQuerySchema, 
  CreateBuyerSchema, 
  UpdateBuyerSchema,
  CSVBuyerSchema 
} from '../validators/buyer';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import multer from 'multer';
import { Readable } from 'stream';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// GET /buyers - List buyers with pagination, filtering, and search
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const query = BuyerQuerySchema.parse(req.query);
    const { page, limit, search, city, propertyType, status, timeline, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search across fullName, phone, email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filters
    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;

    // Execute query with pagination
    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.buyer.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      buyers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /buyers - Create new buyer
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = CreateBuyerSchema.parse(req.body);
    
    const buyer = await prisma.buyer.create({
      data: {
        ...data,
        ownerId: req.user!.id
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create history entry
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: req.user!.id,
        diff: { action: 'created', data }
      }
    });

    res.status(201).json(buyer);
  } catch (error) {
    next(error);
  }
});

// GET /buyers/:id - Get single buyer
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        history: {
          take: 5,
          orderBy: { changedAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    res.json(buyer);
  } catch (error) {
    next(error);
  }
});

// PUT /buyers/:id - Update buyer (with ownership and concurrency checks)
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = UpdateBuyerSchema.parse(req.body);
    const { updatedAt: clientUpdatedAt, ...updateData } = data;

    // Check if buyer exists and get current state
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id: req.params.id }
    });

    if (!existingBuyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Ownership check - users can only edit their own buyers (unless admin)
    if (existingBuyer.ownerId !== req.user!.id && !req.user!.isAdmin) {
      return res.status(403).json({ error: 'You can only edit your own buyers' });
    }

    // Concurrency check - if client provided updatedAt, ensure it matches
    if (clientUpdatedAt) {
      const clientTime = new Date(clientUpdatedAt);
      const serverTime = new Date(existingBuyer.updatedAt);
      
      if (clientTime.getTime() !== serverTime.getTime()) {
        return res.status(409).json({
          error: 'Record has been modified by another user',
          message: 'Please refresh and try again',
          currentUpdatedAt: existingBuyer.updatedAt
        });
      }
    }

    // Calculate diff for history
    const changes: any = {};
    Object.keys(updateData).forEach(key => {
      const oldValue = (existingBuyer as any)[key];
      const newValue = (updateData as any)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[key] = { from: oldValue, to: newValue };
      }
    });

    // Update buyer
    const buyer = await prisma.buyer.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create history entry if there were changes
    if (Object.keys(changes).length > 0) {
      await prisma.buyerHistory.create({
        data: {
          buyerId: buyer.id,
          changedBy: req.user!.id,
          diff: { action: 'updated', changes }
        }
      });
    }

    res.json(buyer);
  } catch (error) {
    next(error);
  }
});

// DELETE /buyers/:id - Delete buyer (with ownership check)
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: req.params.id }
    });

    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Ownership check
    if (buyer.ownerId !== req.user!.id && !req.user!.isAdmin) {
      return res.status(403).json({ error: 'You can only delete your own buyers' });
    }

    // Create history entry before deletion
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: req.user!.id,
        diff: { action: 'deleted', data: buyer }
      }
    });

    await prisma.buyer.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// POST /buyers/import - CSV import (max 200 rows)
router.post('/import', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const results: any[] = [];
    const errors: any[] = [];
    let rowNumber = 0;

    // Parse CSV
    const stream = Readable.from(req.file.buffer);
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => {
          rowNumber++;
          
          // Limit to 200 rows as per problem statement
          if (rowNumber > 200) {
            return;
          }

          try {
            const validated = CSVBuyerSchema.parse(data);
            results.push({ row: rowNumber, data: validated });
          } catch (error: any) {
            errors.push({
              row: rowNumber,
              errors: error.errors?.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message
              })) || [{ field: 'unknown', message: error.message }]
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (rowNumber > 200) {
      return res.status(400).json({
        error: 'Too many rows',
        message: 'CSV import is limited to 200 rows maximum'
      });
    }

    // Insert valid rows in transaction
    const createdBuyers = await prisma.$transaction(async (tx) => {
      const buyers = [];
      
      for (const result of results) {
        const buyer = await tx.buyer.create({
          data: {
            ...result.data,
            ownerId: req.user!.id
          }
        });

        // Create history entry
        await tx.buyerHistory.create({
          data: {
            buyerId: buyer.id,
            changedBy: req.user!.id,
            diff: { action: 'imported', data: result.data, row: result.row }
          }
        });

        buyers.push(buyer);
      }

      return buyers;
    });

    res.json({
      imported: createdBuyers.length,
      errors: errors.length,
      errorDetails: errors,
      buyers: createdBuyers
    });
  } catch (error) {
    next(error);
  }
});

// GET /buyers/export - CSV export with current filters
router.get('/export', async (req: AuthRequest, res, next) => {
  try {
    const query = BuyerQuerySchema.parse(req.query);
    const { search, city, propertyType, status, timeline, sortBy, sortOrder } = query;

    // Build where clause (same as list endpoint)
    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;

    // Get all matching buyers (no pagination for export)
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: {
          select: { name: true, email: true }
        }
      }
    });

    // Generate CSV
    const csvData = buyers.map(buyer => ({
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk || '',
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin || '',
      budgetMax: buyer.budgetMax || '',
      timeline: buyer.timeline,
      source: buyer.source,
      notes: buyer.notes || '',
      tags: buyer.tags.join(','),
      status: buyer.status,
      owner: buyer.owner.name,
      createdAt: buyer.createdAt.toISOString(),
      updatedAt: buyer.updatedAt.toISOString()
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=buyers-export-${new Date().toISOString().split('T')[0]}.csv`);

    // Convert to CSV string
    if (csvData.length === 0) {
      return res.send('No data to export');
    }

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = (row as any)[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

export default router;
