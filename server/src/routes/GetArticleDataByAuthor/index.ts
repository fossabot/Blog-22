// src/routes/Login/index.ts
import express, { Request, Response } from 'express';
import { GetArticleDataByAuthor } from './GetArticleDataByAuthor';
import { LoginData as LD } from '../../Return To Client/interface';
const router = express.Router();
function transformUserData(body: any): LD {
    return {
        ...body.UserData,
        encUserData: {
            ...body.UserData.encUserData,
            iv: Buffer.from(body.UserData.encUserData.iv.data),
            encryptedData: Buffer.from(body.UserData.encUserData.encryptedData.data),
            tag: Buffer.from(body.UserData.encUserData.tag.data)
        }
    } as LD;
}

router.post('/getArticleDataByAuthor', async (req: Request, res: Response) =>
{
    const body = req.body as { UserData: LD};
    if (body.UserData === undefined)
    {
      res.json({ code: -101, message: 'Data is not complete' });
      return;
    }
    const transformedUserData = transformUserData(body);

    const getArticleDataByAuthor = new GetArticleDataByAuthor();
    const returnData = await getArticleDataByAuthor.getArticleDataByAuthor(transformedUserData)
    res.json(returnData);
});
export default router;