// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAuth } from "firebase-admin/auth";
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  exists: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') return res.status(405).end()
  getAuth()
    .getUserByEmail(decodeURIComponent(req.query.email as string))
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      res.status(200).json({ exists: true })

    })
    .catch(({ errorInfo }) => {
      console.log('Error fetching user data:', errorInfo);
      if (errorInfo.code === 'auth/user-not-found') {
        res.status(200).json({ exists: false })
      }
      else
        res.status(404).send(errorInfo)
    });
}
