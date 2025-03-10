import {MongoClient} from 'mongodb';
import {envConfig} from '../utils/envConfig';
import {logger} from '../utils/logger';
import {AppError} from '../../apps/api/utils/errors';

const {dbName, host, password, port, username} = envConfig().mongoDb;
const url = `mongodb://${username}:${password}@${host}:${port}`;

export class DatabaseService {
  private static instance: MongoClient | null = null;

  private constructor() {}

  public static async connect() {
    if (!DatabaseService.instance) {
      logger.info('MongoDB: Initializing connection to the server');
      DatabaseService.instance = new MongoClient(url);
      await DatabaseService.instance.connect();
      logger.info('MongoDB: Connected successfully to the server');
    }
  }

  public static getDatabaseClient() {
    return DatabaseService.instance;
  }

  public static getUsersCollection() {
    if (DatabaseService.instance) {
      return DatabaseService.instance.db(dbName).collection('users');
    } else {
      throw new AppError(
        'mongodb.errors.collectionRetreivalError',
        500,
        'error getting users collection',
        false,
      );
    }
  }
}
