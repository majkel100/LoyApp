//
//  SNRClient.h
//  SyneriseSDK
//
//  Created by Synerise
//  Copyright (c) 2024 Synerise. All rights reserved.
//

#import <SyneriseSDK/SNRTokenOrigin.h>
#import <SyneriseSDK/SNRClientSignOutMode.h>
#import <SyneriseSDK/SNRClientSessionEndReason.h>
#import <SyneriseSDK/SNRClientIdentityProvider.h>
#import <SyneriseSDK/SNRApiError.h>

@class SNRClientEventsApiQuery;
@class SNRClientRegisterAccountContext;
@class SNRClientAuthenticationContext;
@class SNRClientConditionalAuthenticationContext;
@class SNRClientConditionalAuthResult;
@class SNRClientSimpleAuthenticationData;
@class SNRClientAccountInformation;
@class SNRClientEventData;
@class SNRClientUpdateAccountBasicInformationContext;
@class SNRClientUpdateAccountContext;
@class SNRClientPasswordResetRequestContext;
@class SNRClientPasswordResetConfirmationContext;
@class SNRToken;
@class SNRTokenPayload;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol SNRClientStateDelegate
 *
 * A delegate to handle Client's sign-in state changes.
 */

NS_SWIFT_NAME(ClientStateDelegate)
@protocol SNRClientStateDelegate

@optional

/**
 * This method is called when a customer signs in.
 */
- (void)SNR_clientIsSignedIn NS_SWIFT_NAME(snr_clientIsSignedIn());

/**
 * This method is called when a customer signs out.
 *
 * @param reason Specifies the reason for signing out.
 */
- (void)SNR_clientIsSignedOutWithReason:(SNRClientSessionEndReason)reason NS_SWIFT_NAME(snr_clientIsSignedOut(reason:));

@end


/**
 * @class SNRClient
 */

NS_SWIFT_NAME(Client)
@interface SNRClient : NSObject

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;

/**
 * This method sets object for a customer's state delegate methods.
 *
 * @param delegate An object that implements the `SNRClientStateDelegate` protocol.
 */
+ (void)setClientStateDelegate:(id<SNRClientStateDelegate>)delegate;

/**
 * This method registers a new customer with an email, password, and optional data.
 * This method requires the context object with a customer’s email, password, and optional data. Omitted fields are not modified.
 * Depending on the backend configuration, the account may require activation.
 *
 * @param context `SNRClientRegisterAccountContext` object with client's email, password, and other optional data. Fields that are not provided are not modified.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note Do NOT allow signing in again (or signing up) when a customer is already signed in. Sign the customer out first.
 * @note Do NOT create multiple instances nor call this method multiple times before execution.
 */
+ (void)registerAccount:(SNRClientRegisterAccountContext *)context
                success:(void (^)(void))success
                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(registerAccount(context:success:failure:));

/**
 * This method requests sending an email with a URL that confirms the registration and activates the account.
 *
 * @param email Client’s email.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)requestAccountActivationWithEmail:(NSString *)email
                                  success:(void (^)(void))success
                                  failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(requestAccountActivation(email:success:failure:));

/**
 * This method confirms a customer account with the confirmation token.
 *
 * @param token Confirmation token.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)confirmAccountActivationByToken:(NSString *)token
                                success:(void (^)(void))success
                                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(confirmAccountActivation(token:success:failure:));

/**
 * This method requests a customer's account registration process with the PIN code.
 *
 * @param email Client’s email.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)requestAccountActivationByPinWithEmail:(NSString *)email
                                       success:(void (^)(void))success
                                       failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(requestAccountActivationByPin(email:success:failure:));

/**
 * This method confirms a customer's account registration process with the PIN code.
 *
 * @param pinCode Code sent to your email.
 * @param email Client’s email.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)confirmAccountActivationByPin:(NSString *)pinCode
                                email:(NSString *)email
                              success:(void (^)(void))success
                              failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(confirmAccountActivationByPin(pinCode:email:success:failure:));

/**
 * This method signs a customer in to obtain a JSON Web Token (JWT) which can be used in subsequent requests.
 * The SDK will refresh the token before each call if it is about to expire (but not expired).
 *
 * @param email Client's email.
 * @param password Client's password.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note Do NOT allow signing in again (or signing up) when a customer is already signed in. First, sign the customer out.
 * @note Do NOT create multiple instances nor call this method multiple times before execution.
 */
+ (void)signInWithEmail:(NSString *)email
               password:(NSString *)password
                success:(void (^)(void))success
                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(signIn(email:password:success:failure:));

/**
 * This method signs a customer in to obtain a JSON Web Token (JWT) which can be used in subsequent requests.
 * The SDK will refresh the token before each call if it is about to expire (but not expired).
 *
 * @param email Client's email.
 * @param password Client's password.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note Do NOT allow signing in again (or signing up) when a customer is already signed in. First, sign the customer out.
 * @note Do NOT create multiple instances nor call this method multiple times before execution.
 */
+ (void)signInConditionallyWithEmail:(NSString *)email
                            password:(NSString *)password
                             success:(void (^)(SNRClientConditionalAuthResult *authResult))success
                             failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(signInConditionally(email:password:success:failure:));

/**
 * This method authenticates a customer with OAuth, Facebook, Google, Apple, or Synerise.
 * If an account for the customer does not exist and the identity provider is different than Synerise, this request creates an account.
 *
 * @param token  Client's token (OAuth, Facebook, Apple etc.).
 * @param clientIdentityProvider Client's identity provider.
 * @param authID Authorization custom identity.
 * @param context `SNRClientAuthenticationContext` object with agreements and optional attributes.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)authenticateWithToken:(id)token
       clientIdentityProvider:(SNRClientIdentityProvider)clientIdentityProvider
                       authID:(nullable NSString *)authID
                      context:(nullable SNRClientAuthenticationContext *)context
                      success:(void (^)(void))success
                      failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(authenticate(token:clientIdentityProvider:authID:context:success:failure:));

/**
 * This method authenticates a customer with OAuth, Facebook, Google, Apple, or Synerise.
 * If an account for the customer does not exist and the identity provider is different than Synerise, this request creates an account.
 *
 * @param token  Client's token (OAuth, Facebook, Apple etc.).
 * @param clientIdentityProvider Client's identity provider.
 * @param authID Authorization custom identity.
 * @param context `SNRClientConditionalAuthenticationContext` object with agreements and optional attributes.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)authenticateConditionallyWithToken:(id)token
                    clientIdentityProvider:(SNRClientIdentityProvider)clientIdentityProvider
                                    authID:(nullable NSString *)authID
                                   context:(nullable SNRClientConditionalAuthenticationContext *)context
                                   success:(void (^)(SNRClientConditionalAuthResult *authResult))success
                                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(authenticateConditionally(token:clientIdentityProvider:authID:context:success:failure:));

/**
 * This method signs in a customer in with the provided token payload.
 *
 * @param tokenPayload `SNRTokenPayload` object with a token's payload.
 * @param authID Authorization custom identity.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)authenticateWithTokenPayload:(SNRTokenPayload *)tokenPayload authID:(NSString *)authID success:(void (^)(void))success failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(authenticate(tokenPayload:authID:success:failure:));

/**
 * This method authenticates a customer with Simple Authentication.
 *
 * @param data `SNRClientSimpleAuthenticationData` object with client's data information to be modified. Fields that are not provided are not modified.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note When you use this method, you must set a request validation salt by using the `Synerise.setRequestValidationSalt(_:)` method (if salt is enabled for Simple Authentication).
 */
+ (void)simpleAuthentication:(SNRClientSimpleAuthenticationData *)data
                      authID:(NSString *)authID
                     success:(void (^)(void))success
                     failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(simpleAuthentication(data:authID:success:failure:));

/**
 * This method checks if a customer is signed in (via RaaS, OAuth, Facebook, Apple).
 */
+ (BOOL)isSignedIn;

/**
 * This method checks if a customer is signed in (via Simple Authentication).
 */
+ (BOOL)isSignedInViaSimpleAuthentication;

/**
 * This method signs out a customer out.
 *
 * @note This method works with every authentication type (via Synerise, External Provider, OAuth or Simple Authentication).
 */
+ (void)signOut NS_SWIFT_NAME(signOut());

/**
 * This method signs out a customer out with a chosen mode.
 *
 * @param mode Logout mode.
 * @param fromAllDevices Determines whether it should sign out all devices.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method works with every authentication type (via Synerise, External Provider, OAuth or Simple Authentication).
 */
+ (void)signOutWithMode:(SNRClientSignOutMode)mode
         fromAllDevices:(BOOL)fromAllDevices
                success:(void (^)(void))success
                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(signOut(mode:fromAllDevices:success:failure:));

/**
 * This method refreshes the customer’s current token.
 *
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note Returns an error if the customer is not logged in or the token has expired and cannot be refreshed.
 */
+ (void)refreshTokenWithSuccess:(void (^)(void))success
                        failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(refreshToken(success:failure:));

/**
 * This method retrieves the customer’s current, active token.
 *
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note Returns an error if the customer is not logged in or the token has expired and cannot be retrieved.
 */
+ (void)retrieveTokenWithSuccess:(void (^)(SNRToken *token))success
                         failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(retrieveToken(success:failure:));

/**
 * This method retrieves the customer’s current UUID.
 */
+ (NSString *)getUUID;

/**
 * This method retrieves the current UUID or generates a new one from a seed.
 * This operation doesn't affect the customer session in the SDK.
 *
 * @param authID A seed for UUID generation.
 */
+ (NSString *)getUUIDForAuthenticationWithAuthID:(NSString *)authID NS_SWIFT_NAME(getUUIDForAuthentication(authID:));

/**
 * This method regenerates the UUID and clears the authentication token, login session, custom email, and custom identifier.
 * This operation works only if the customer is anonymous.
 * This operation clears authentication token, login (if applicable), custom email and custom identifier.
 */
+ (BOOL)regenerateUUID;

/**
 * This method regenerates the UUID and clears the authentication token, login session, custom email, and custom identifier.
 * This operation works only if the customer is anonymous.
 * This operation clears authentication token, login (if applicable), custom email and custom identifier.
 *
 * @param clientIdentifier A seed for UUID generation.
 */
+ (BOOL)regenerateUUIDWithClientIdentifier:(NSString *)clientIdentifier NS_SWIFT_NAME(regenerateUUID(clientIdentifier:));

/**
 * This method destroys the session completely.
 * This method clears all session data (both client and anonymous) and removes cached data. Then, it regenerates the UUID and creates the new anonymous session.
 */
+ (void)destroySession NS_SWIFT_NAME(destroySession());

/**
 * This method gets a customer’s account information.
 *
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method requires customer authentication.
 */
+ (void)getAccountWithSuccess:(void (^)(SNRClientAccountInformation *accountInformation))success
                      failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getAccount(success:failure:));

/**
 * This method retrieves events for an authenticated customer.
 *
 * @param apiQuery `SNRClientEventsApiQuery` object responsible for storing all query parameters.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method requires customer authentication.
 */
+ (void)getEventsWithApiQuery:(SNRClientEventsApiQuery *)apiQuery
                      success:(void (^)(NSArray<SNRClientEventData *> *events))success
                      failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(getEvents(apiQuery:success:failure:));

/**
 * This method updates a customer’s account’s basic information (without identification data: uuid, customId, email).
 * This method requires the context object with the customer’s account information. Omitted fields are not modified.
 * This method does not require customer authentication and can be used for anonymous profiles.
 *
 * @param context `SNRClientUpdateAccountBasicInformationContext` object with account basic information to be modified. Fields that are not provided are not modified.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)updateAccountBasicInformation:(SNRClientUpdateAccountBasicInformationContext *)context
                              success:(void (^)(void))success
                              failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(updateAccountBasicInformation(context:success:failure:));

/**
 * This method updates a customer’s account information.
 * This method requires the context object with the customer’s account information. Omitted fields are not modified.
 *
 * @param context `SNRClientUpdateAccountContext` object with client's account information to be modified. Fields that are not provided are not modified.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method requires customer authentication.
 */
+ (void)updateAccount:(SNRClientUpdateAccountContext *)context
              success:(void (^)(void))success
              failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(updateAccount(context:success:failure:));

/**
 * This method requests a customer’s password reset with email. The customer will receive a token to the provided email address. That token is then used for the confirmation of password reset.
 * This method requires the customer’s email.
 *
 * @param context `SNRClientPasswordResetRequestContext` object with client's email.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 */
+ (void)requestPasswordReset:(SNRClientPasswordResetRequestContext *)context
                     success:(void (^)(void))success
                     failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(requestPasswordReset(context:success:failure:));

/**
 * This method confirm a customer’s password reset with the new password and token provided by password reset request.
 * This method requires the customer’s new password and the confirmation token received by e-mail.
 *
 * @param context `SNRClientPasswordResetConfirmationContext` object with client's new password and token.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 */
+ (void)confirmResetPassword:(SNRClientPasswordResetConfirmationContext *)context
                     success:(void (^)(void))success
                     failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(confirmResetPassword(context:success:failure:));

/**
 * This method changes a customer’s password.
 *
 * @param password Client's new password.
 * @param oldPassword Client's old password.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method requires customer authentication.
 * @note Returns the HTTP 403 status code if the provided old password is invalid.
 */
+ (void)changePassword:(NSString *)password
           oldPassword:(NSString *)oldPassword
               success:(void (^)(void))success
               failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(changePassword(password:oldPassword:success:failure:));

/**
 * This method requests a customer's email change.
 *
 * @param email Client's new email.
 * @param password Client's password (if Synerise account).
 * @param externalToken Client's token (if OAuth, Facebook, Apple etc.).
 * @param authID Authorization custom identity.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 * @note Returns the HTTP 403 status code if the provided token or the password is invalid.
 */
+ (void)requestEmailChange:(NSString *)email
                  password:(nullable NSString *)password
             externalToken:(nullable id)externalToken
                  authID:(nullable NSString *)authID
                   success:(void (^)(void))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(requestEmailChange(email:password:externalToken:authID:success:failure:));

/**
 * This method confirms an email change.
 *
 * @param token Client's token provided by email.
 * @param newsletterAgreement Agreement for newsletter with email provided.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 * @note Returns the HTTP 403 status code if the provided token is invalid.
 */
+ (void)confirmEmailChange:(NSString *)token
        newsletterAgreement:(BOOL)newsletterAgreement
                   success:(void (^)(void))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(confirmEmailChange(token:newsletterAgreement:success:failure:));

/**
 * This method requests a customer's phone update. A confirmation code is sent to the phone number.
 *
 * @param phone Client's phone number.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 */
+ (void)requestPhoneUpdate:(NSString *)phone
                   success:(void (^)(void))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(requestPhoneUpdate(phone:success:failure:));

/**
 * This method confirms a phone number update. This action requires the new phone number and confirmation code as parameters.
 *
 * @param phone Client's new phone number.
 * @param smsAgreement Agreement for SMS marketing for the new phone number.
 * @param confirmationCode Client's confirmation code received by phone.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 *
 * @note This method is a global operation and doesn't require customer authentication.
 */
+ (void)confirmPhoneUpdate:(NSString *)phone
          confirmationCode:(NSString *)confirmationCode
              smsAgreement:(BOOL)smsAgreement
                   success:(void (^)(void))success
                   failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(confirmPhoneUpdate(phone:confirmationCode:smsAgreement:success:failure:));

/**
 * This method deletes a customer's account.
 *
 * @param clientAuthFactor Client's token (if OAuth, Facebook, Apple etc.) or password (if Synerise account).
 * @param clientIdentityProvider Client's identity provider.
 * @param authID Authorization custom identity.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)deleteAccount:(id)clientAuthFactor
clientIdentityProvider:(SNRClientIdentityProvider)clientIdentityProvider
               authID:(nullable NSString *)authID
              success:(void (^)(void))success
              failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(deleteAccount(clientAuthFactor:clientIdentityProvider:authID:success:failure:));

/**
 * This method recognizes anonymous customer and saves personal information in their database entries.
 *
 * @param email Client's email.
 * @param customIdentify Client's custom identifier.
 * @param parameters Client's custom parameters.
 */
+ (void)recognizeAnonymousWithEmail:(nullable NSString *)email
                     customIdentify:(nullable NSString *)customIdentify
                         parameters:(nullable NSDictionary *)parameters NS_SWIFT_NAME(recognizeAnonymous(email:customIdentify:parameters:));

/**
 * This method passes the Firebase Token to Synerise for notifications.
 *
 * @param registrationToken Firebase FCM Token returned after successful push notifications registration from Firebase.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)registerForPush:(NSString *)registrationToken
                success:(void (^)(void))success
                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(registerForPush(registrationToken:success:failure:));

/**
 * This method passes the Firebase Token to Synerise for notifications and doesn't update the agreement of the profile.
 *
 * @param registrationToken Firebase FCM Token returned after successful push notifications registration from Firebase.
 * @param mobilePushAgreement Agreement (consent) for mobile push campaigns.
 * @param success A block object to be executed when the operation finishes successfully.
 * @param failure A block object to be executed when the operation finishes unsuccessfully.
 */
+ (void)registerForPush:(NSString *)registrationToken
    mobilePushAgreement:(BOOL)mobilePushAgreement
                success:(void (^)(void))success
                failure:(void (^)(SNRApiError *error))failure NS_SWIFT_NAME(registerForPush(registrationToken:mobilePushAgreement:success:failure:));

@end

NS_ASSUME_NONNULL_END
