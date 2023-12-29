import { ConfigurableModuleBuilder } from '@nestjs/common';

export enum ConfigurableModuleBuilderEnum {
  ClassMethodName = 'forRoot',
  FactoryMethodName = 'createModuleConfig',
}

export const createConfigurableModule = <Options>() => {
  const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE } =
    new ConfigurableModuleBuilder<Options>()
      .setClassMethodName(ConfigurableModuleBuilderEnum.ClassMethodName)
      .setFactoryMethodName(ConfigurableModuleBuilderEnum.FactoryMethodName)
      .build();
  return { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE };
};
