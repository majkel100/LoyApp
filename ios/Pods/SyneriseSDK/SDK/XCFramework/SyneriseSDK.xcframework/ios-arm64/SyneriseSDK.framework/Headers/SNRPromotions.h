//
//  SNRPromotions.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

@class SNRPromotionsApiQuery;
@class SNRPromotionResponse;
@class SNRPromotionIdentifier;
@class SNRPromotion;
@class SNRAssignVoucherResponse;
@class SNRVoucherCodesResponse;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class SNRPromotions
 */

NS_SWIFT_NAME(Promotions)
@interface SNRPromotions : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This method retrieves all available promotions that are defined for a customer.
 *
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getPromotionsWithSuccess:(void (^)(SNRPromotionResponse *promotionResponse))success
                         failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getPromotions(success:failure:));

/**
 * This method retrieves promotions that match the parameters defined in the query object.
 *
 * @param apiQuery `SNRPromotionsApiQuery` object responsible for storing all query parameters.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getPromotionsWithApiQuery:(SNRPromotionsApiQuery *)apiQuery
                          success:(void (^)(SNRPromotionResponse *promotionResponse))success
                          failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getPromotions(apiQuery:success:failure:));

/**
 * This method retrieves the promotion with the specified UUID.
 *
 * @param uuid UUID of the promotion.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getPromotionByUuid:(NSString *)uuid
                   success:(void (^)(SNRPromotion *promotion))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getPromotion(uuid:success:failure:));

/**
 * This method retrieves the promotion with the specified code.
 *
 * @param code Code of the promotion.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getPromotionByCode:(NSString *)code
                   success:(void (^)(SNRPromotion *promotion))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getPromotion(code:success:failure:));

/**
 * This method activates the promotion with the specified UUID.
 *
 * @param uuid UUID of the promotion that will be activated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)activatePromotionByUuid:(NSString *)uuid
                        success:(void (^)(void))success
                        failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(activatePromotion(uuid:success:failure:));

/**
 * This method activates the promotion with the specified code.
 *
 * @param code Code of the promotion that will be activated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)activatePromotionByCode:(NSString *)code
                        success:(void (^)(void))success
                        failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(activatePromotion(code:success:failure:));

/**
 * This method activates promotions with a code or with UUID in a batch.
 *
 * @param identifiers List of promotion identifiers to be activated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */

+ (void)activatePromotionsWithIdentifiers:(NSArray<SNRPromotionIdentifier *> *)identifiers
                                  success:(void (^)(void))success
                                  failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(activatePromotions(identifiers:success:failure:));

/**
 * This method deactivates the promotion with the specified UUID.
 *
 * @param uuid UUID of the promotion that will be deactivated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)deactivatePromotionByUuid:(NSString *)uuid
                          success:(void (^)(void))success
                          failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(deactivatePromotion(uuid:success:failure:));

/**
 * This method deactivates the promotion with the specified code.
 *
 * @param code Code of the promotion that will be deactivated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)deactivatePromotionByCode:(NSString *)code
                          success:(void (^)(void))success
                          failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(deactivatePromotion(code:success:failure:));

/**
 * This method deactivates promotions with a code or with UUID in a batch.
 *
 * @param identifiers List of promotion identifiers to be deactivated.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */

+ (void)deactivatePromotionsWithIdentifiers:(NSArray<SNRPromotionIdentifier *> *)identifiers
                                    success:(void (^)(void))success
                                    failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(deactivatePromotions(identifiers:success:failure:));

/**
 * This method retrieves an assigned voucher code or assigns a voucher from a pool identified by UUID to the customer.
 * Once a voucher is assigned using this method, the same voucher is returned for the profile every time the method is called.
 *
 * @param poolUUID Pool's universally unique identifier.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note When the voucher is assigned for the first time, a `voucherCode.assigned` event is produced.
 */
+ (void)getOrAssignVoucherWithPoolUUID:(NSString *)poolUUID
                               success:(void (^)(SNRAssignVoucherResponse *assignVoucherResponse))success
                               failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getOrAssignVoucher(poolUUID:success:failure:));

/**
 * This method assigns a voucher from a pool identified by UUID to the profile.
 * Every request returns a different code until the pool is empty.
 *
 * @param poolUUID Pool's universally unique identifier.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note 416 HTTP status code is returned when pool is empty.
 */
+ (void)assignVoucherCodeWithPoolUUID:(NSString *)poolUUID
                              success:(void (^)(SNRAssignVoucherResponse *assignVoucherResponse))success
                              failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(assignVoucherCode(poolUUID:success:failure:));

/**
 * This method retrieves voucher codes for a customer.
 *
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)getAssignedVoucherCodesWithSuccess:(void (^)(SNRVoucherCodesResponse *voucherCodesResponse))success
                                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getAssignedVoucherCodes(success:failure:));

@end

NS_ASSUME_NONNULL_END
