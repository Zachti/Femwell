import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './configModuleOptions';
import { DynamicModule, Module } from '@nestjs/common';
import { commonConfig, commonConfigValidationSchema } from './common.config';

@Module({})
export class ConfigCoreModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const { isGlobal, configObjects, validationOptions } = options;
    return {
      module: ConfigCoreModule,
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
      providers: [ConfigCoreModule],
      exports: [ConfigCoreModule],
    };
  }
}
