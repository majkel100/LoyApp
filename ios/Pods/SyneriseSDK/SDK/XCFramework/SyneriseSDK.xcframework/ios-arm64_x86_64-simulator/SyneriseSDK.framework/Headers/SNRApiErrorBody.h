//
//  SNRApiErrorBody.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import "SNRApiErrorCause.h"

NS_ASSUME_NONNULL_BEGIN

@interface SNRApiErrorBody : NSObject

@property (strong, nonatomic, nullable, readonly) NSString *internalErrorCode;
@property (strong, nonatomic, nullable, readonly) NSString *error;
@property (strong, nonatomic, nullable, readonly) NSString *message;
@property (strong, nonatomic, nullable, readonly) NSString *path;
@property (assign, nonatomic, readonly) NSInteger status;

@property (strong, nonatomic, nullable, readonly) NSArray<SNRApiErrorCause *> *errorCauses;

@end

NS_ASSUME_NONNULL_END
