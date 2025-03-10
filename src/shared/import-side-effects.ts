import {config} from 'dotenv';

import {DatabaseService} from './db/db';
import {logger} from './utils/logger';

config();

// Now that I think this can be a wrong solution, because we may not need the db initialization for each microservice.
// but I do not want to spend to much time on this
DatabaseService.connect().catch(err => {
  logger.error('Database initialization error');
});
