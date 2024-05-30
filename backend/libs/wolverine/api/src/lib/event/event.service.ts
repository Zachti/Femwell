import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { SnsService } from '../sns/sns.service';
import { ConfigType } from '@nestjs/config';
import { wolverineConfig } from '../config/wolverine.config';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Event } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventService {
  constructor(
    private readonly notificationService: SnsService,
    private readonly logger: LoggerService,
    @Inject(wolverineConfig.KEY)
    private readonly Cfg: ConfigType<typeof wolverineConfig>,
    private readonly prisma: PrismaService,
  ) {}
  create(createEventInput: CreateEventInput): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title: createEventInput.title,
        date: new Date(createEventInput.date),
        duration: createEventInput.duration,
        userId: createEventInput.userId,
      },
    });
  }

  findAll(userId: string): Promise<Event[]> {
    return this.prisma.event.findMany({ where: { userId } });
  }

  findOne(id: number): Promise<Event> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  update(id: number, updateEventInput: UpdateEventInput): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data: updateEventInput });
  }

  remove(id: number): Promise<Event> {
    return this.prisma.event.delete({ where: { id } });
  }

  @Cron(CronExpression.EVERY_MINUTE)
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

  @Cron(CronExpression.EVERY_MINUTE)
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
