#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "NSDictionary+ReactNative.h"
#import "NSMutableDictionary+ReactNative.h"
#import "RNSyneriseEventEmitter.h"
#import "RNSyneriseInitializer.h"
#import "RNSyneriseManager.h"
#import "RNBaseModule.h"
#import "RNClient.h"
#import "RNContent.h"
#import "RNInjector.h"
#import "RNPromotions.h"
#import "RNSettings.h"
#import "RNSynerise.h"
#import "RNSyneriseNotifications.h"
#import "RNTracker.h"
#import "ReactNativeSynerise.h"

FOUNDATION_EXPORT double react_native_synerise_sdkVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_synerise_sdkVersionString[];

