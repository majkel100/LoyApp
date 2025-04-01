import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { Paths, TabPaths } from '@/navigation/paths';

export type RootStackParamList = {
  [Paths.Example]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Tabs]: undefined;
};

export type TabParamList = {
  [TabPaths.Home]: undefined;
  [TabPaths.Profile]: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type TabScreenProps<
  S extends keyof TabParamList = keyof TabParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, S>,
  StackScreenProps<RootStackParamList>
>;
