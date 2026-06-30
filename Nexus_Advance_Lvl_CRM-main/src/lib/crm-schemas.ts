import { z } from 'zod';

export const idSchema = z.string().min(1);

export const clientCreateSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial().omit({ password: true });

export const projectCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  clientId: z.string().min(1),
  proposalId: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'on-hold']).optional(),
  startDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  progress: z.number().min(0).max(100).optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const taskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string().min(1),
  clientId: z.string().min(1),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const notificationCreateSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'success', 'warning', 'error']).optional(),
  read: z.boolean().optional(),
});

export const notificationUpdateSchema = notificationCreateSchema.partial();
