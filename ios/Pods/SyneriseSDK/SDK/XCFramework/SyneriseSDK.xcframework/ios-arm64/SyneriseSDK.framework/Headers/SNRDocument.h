//
//  SNRDocument.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <SyneriseSDK/SNRBaseModel.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @class SNRDocument
 *
 */

NS_SWIFT_NAME(Document)
@interface SNRDocument : SNRBaseModel

@property (copy, nonatomic, nonnull, readonly) NSString *uuid;
@property (copy, nonatomic, nonnull, readonly) NSString *slug;
@property (copy, nonatomic, nonnull, readonly) NSString *schema;
@property (copy, nonatomic, nullable, readonly) NSDictionary *content;

@end

NS_ASSUME_NONNULL_END
