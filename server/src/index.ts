import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import campaignSchedulerService from '@src/services/CampaignSchedulerService';


/******************************************************************************
                                  Run
******************************************************************************/

const SERVER_START_MSG = ('Express server started on port: ' +
  ENV.Port.toString());

server.listen(ENV.Port, () => {
  logger.info(SERVER_START_MSG);

  // Khởi động campaign scheduler
  campaignSchedulerService.startScheduler();
  logger.info('Campaign scheduler initialized');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  campaignSchedulerService.stopScheduler();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  campaignSchedulerService.stopScheduler();
  process.exit(0);
});
