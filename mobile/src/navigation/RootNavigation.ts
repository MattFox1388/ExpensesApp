import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef: React.Ref<NavigationContainerRef<ReactNavigation.RootParamList>> = React.createRef();

export function navigate(name: unknown, params: unknown): any{
  navigationRef?.current?.navigate(name, params);
}