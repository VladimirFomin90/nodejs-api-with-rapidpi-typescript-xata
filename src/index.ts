import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getXataClient, Job } from './xata';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(express.json());

const xata = getXataClient();

type MyResponse<T> =
    | {
          error: string;
      }
    | {
          data: T;
      };

app.get('/api/jobs', async (req: Request, res: Response<MyResponse<Job[]>>) => {
    try {
        const jobs = await xata.db.job.getAll();
        return res.status(200).json({ data: jobs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post(
    '/api/jobs',
    async (req: Request<{}, {}, Job>, res: Response<MyResponse<Job>>) => {
        try {
            const job = req.body;
            const createdJob = await xata.db.job.create(job);
            throw new Error('fuck! fuck!');
            return res.status(201).json({ data: createdJob });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    },
);

app.put(
    '/api/jobs/:id',
    async (
        req: Request<{ id: string }, {}, Job>,
        res: Response<MyResponse<Job>>,
    ) => {
        try {
            const id = req.params.id;
            const job = req.body;
            const updatedJob = await xata.db.job.update(id, job);

            if (!updatedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.status(200).json({ data: updatedJob });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    },
);

app.delete(
    '/api/jobs/:id',
    async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<MyResponse<Job>>,
    ) => {
        try {
            const id = req.params.id;
            const deletedJob = await xata.db.job.delete(id);

            if (!deletedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.status(200).json({ data: deletedJob });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    },
);

app.listen(port, () => {
    console.log(`server runnning on port ${port}`);
});
