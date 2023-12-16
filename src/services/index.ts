import ImageModel from '../models/images';
import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';

// initialize configuration
dotenv.config();

class defaultService {
  private s3Client: S3Client;
  private s3Region: string;
  private s3Bucket: string;

  constructor() {
    this.s3Region = process.env.AWS_S3_REGION;
    this.s3Bucket = process.env.AWS_S3_BUCKET;
    this.s3Client = new S3Client({ region: this.s3Region, credentials: fromEnv() });

    this.getExpiredImage = this.getExpiredImage.bind(this);
  }

  async getExpiredImage() {
    try {
      console.log("Cron job started");

      const docs = await ImageModel.find({
        lifespan: {
          $ne: 'infinite',
        },
        createdAt: {
          $lte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))
        }
      }).sort({ createdAt: 1 }).limit(20);

      await Promise.all(
        docs.map(async(doc) => {
          try {
            const input = { // DeleteObjectRequest
              Bucket: this.s3Bucket,
              Key: `${doc.root}/${doc.name}`,
            };
            const command = new DeleteObjectCommand(input);

            await this.s3Client.send(command);
            await ImageModel.deleteOne({ _id: doc.id });

            console.log(`Successful deleted ${doc.root}/${doc.name} from S3 bucket for doc.id: ${doc.id}`);
          } catch (error) {
            console.log(`Error deleting ${doc.root}/${doc.name} from S3 bucket for doc.id: ${doc.id}`);
          }
        })
      );

      console.log("Cron job ended");
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default defaultService;
