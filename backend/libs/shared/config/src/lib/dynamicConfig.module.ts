import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './configModuleOptions';
import { DynamicModule, Module } from '@nestjs/common';
import { commonConfig, commonConfigValidationSchema } from './common.config';

@Module({})
export class DynamicConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const { isGlobal, configObjects, validationOptions } = options;
    return {
      module: DynamicConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: isGlobal,
          load: [
            ...configObjects.map((configObject) => configObject.config),
            commonConfig,
          ],
          validationSchema: configObjects
            .map((configObject) => configObject.validationSchema)
            .reduce((curr, next) => {
              return curr.concat(next);
            })
            .concat(commonConfigValidationSchema),
          validationOptions: validationOptions ?? undefined,
        }),
      ],
      providers: [DynamicConfigModule],
      exports: [DynamicConfigModule],
    };
  }
}
