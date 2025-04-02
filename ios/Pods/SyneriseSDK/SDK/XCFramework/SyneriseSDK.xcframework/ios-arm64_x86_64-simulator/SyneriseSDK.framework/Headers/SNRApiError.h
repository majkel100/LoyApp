//
//  SNRApiError.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <SyneriseSDK/SNRError.h>
#import <SyneriseSDK/SNRApiErrorBody.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * @enum SNRApiErrorType
 */

typedef NS_ENUM(NSInteger, SNRApiErrorType) {
    SNRApiErrorTypeUnknown,
    SNRApiErrorTypeNetwork,
    SNRApiErrorTypeUnauthorizedSession,
    SNRApiErrorTypeHttp
};

/**
 * @enum SNRApiErrorHttpErrorCategory
 */

typedef NS_ENUM(NSInteger, SNRApiErrorHttpErrorCategory) {
    SNRApiErrorHttpErrorCategoryBadRequest,
    SNRApiErrorHttpErrorCategoryUnauthorized,
    SNRApiErrorHttpErrorCategoryForbidden,
    SNRApiErrorHttpErrorCategoryNotFound,
    SNRApiErrorHttpErrorCategoryRangeNotSatisfable,
    SNRApiErrorHttpErrorCategoryServerError,
    SNRApiErrorHttpErrorCategoryUnknown
};

/**
 * @class SNRApiError
 */

@interface SNRApiError : SNRError

@property (strong, nonatomic, nonnull, readonly) SNRApiErrorBody *errorBody;
@property (assign, nonatomic, readonly) SNRApiErrorType errorType;
@property (assign, nonatomic, readonly) NSInteger httpCode;
@property (assign, nonatomic, readonly) SNRApiErrorHttpErrorCategory httpErrorCategory;

@property (strong, nonatomic, nullable, readonly) NSArray<SNRError *> *errors;

- (SNRApiErrorType)getType DEPRECATED_MSG_ATTRIBUTE("Use `errorType` property instead.");
- (NSInteger)getHttpCode DEPRECATED_MSG_ATTRIBUTE("Use `httpCode` property instead.");
- (nullable NSString *)getErrorCode DEPRECATED_MSG_ATTRIBUTE("Use `errorBody` property instead.");
- (nullable NSString *)getBody DEPRECATED_MSG_ATTRIBUTE("Use `errorBody` property instead.");

@end

NS_ASSUME_NONNULL_END
