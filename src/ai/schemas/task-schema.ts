
import {z} from 'genkit';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['inbox', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().optional(),
});

    