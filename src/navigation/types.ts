import type { StackScreenProps } from '@react-navigation/stack';
import type { Paths } from '@/navigation/paths';

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Main]: undefined;
  [Paths.LoyaltyCard]: undefined;
  [Paths.Settings]: undefined;
  [Paths.Login]: undefined;
  [Paths.Register]: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
