//
//  SNRScreenViewApiQuery.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

NS_ASSUME_NONNULL_BEGIN

/**
 * @class SNRScreenViewApiQuery
 */

NS_SWIFT_NAME(ScreenViewApiQuery)
@interface SNRScreenViewApiQuery : NSObject

@property (copy, nonatomic, nonnull, readwrite) NSString *feedSlug;
@property (copy, nonatomic, nullable, readwrite) NSString *productID;

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithFeedSlug:(NSString *)feedSlug productID:(nullable NSString *)productID;

@end

NS_ASSUME_NONNULL_END
