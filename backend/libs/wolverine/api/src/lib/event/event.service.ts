import { Inject, Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { NotificationService } from '../sns/sns.service';
import { ConfigType } from '@nestjs/config';
import { wolverineConfig } from '@backend/wolverine';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Event } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ErrorService } from '../shared/error/error.service';
import { LoggerService } from '@backend/logger';

@Injectable()
export class EventService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
    @Inject(wolverineConfig.KEY)
    private readonly Cfg: ConfigType<typeof wolverineConfig>,
    private readonly prisma: PrismaService,
    private readonly error: ErrorService,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    this.logger.debug(`Creating event for user: ${createEventInput.userId}`);
    try {
      const res = this.prisma.event.create({
        data: {
          title: createEventInput.title,
          date: new Date(createEventInput.date),
          duration: createEventInput.duration,
          userId: createEventInput.userId,
        },
      });
      this.logger.debug(`User: ${createEventInput.userId} created event.`, res);
      return res;
    } catch (e) {
      this.error.handleError(e);
    }
  }

  findAll(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  findOne(id: number): Promise<Event> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  update(id: number, input: UpdateEventInput): Promise<Event> {
    this.logger.debug(`Updating event id: ${id} for user: ${input.userId}`);
    try {
      const res = this.prisma.event.update({
        where: { id },
        data: {
          ...input,
          is24HourNotificationSent: false,
          is1HourNotificationSent: false,
        },
      });
      this.logger.debug(`User: ${input.userId} updated event id: ${id}`, res);
      return res;
    } catch (e) {
      this.error.handleError(e);
    }
  }

  async remove(id: number): Promise<Event> {
    this.logger.debug(`Deleting Event id: ${id}`);
    try {
      const res = await this.prisma.event.delete({ where: { id } });
      this.logger.debug(`User: ${res.userId} deleted Event id: ${id}`, res);
      return res;
    } catch (e) {
      this.error.handleError(e);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendNotificationsForEventsWithin24Hours() {
    const events = await this.getEventsWithin24Hours();
    events.forEach((event: Event) => {
      const eventMessage = `Reminder: Event "${event.title}" is scheduled for ${event.date}.`;
      this.notificationService.sendNotification(
        this.Cfg.snsTopicArn,
        eventMessage,
      );
      this.prisma.event.update({
        where: { id: event.id },
        data: { is24HourNotificationSent: true },
      });
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendNotificationsForEventsWithinHour() {
    const events = await this.getEventsWithinHour();
    events.forEach((event: Event) => {
      const eventMessage = `One hour left for Event: "${event.title}".`;
      this.notificationService.sendNotification(
        this.Cfg.snsTopicArn,
        eventMessage,
      );
      this.prisma.event.update({
        where: { id: event.id },
        data: { is1HourNotificationSent: true },
      });
    });
  }

  private getEventsWithin24Hours(): Promise<Event[]> {
    const { currentDate, twentyFourHoursLater } = this.getDates(24);
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: currentDate,
          lte: twentyFourHoursLater,
        },
        is24HourNotificationSent: false,
      },
    });
  }

  private getEventsWithinHour(): Promise<Event[]> {
    const { currentDate, twentyFourHoursLater } = this.getDates(1);
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: currentDate,
          lte: twentyFourHoursLater,
        },
        is1HourNotificationSent: false,
      },
    });
  }

  private getDates(diff: number) {
    const currentDate = new Date();
    const twentyFourHoursLater = new Date();
    twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + diff);
    return { currentDate, twentyFourHoursLater };
  }
}
