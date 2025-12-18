# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.2](https://github.com/safety-lens/mobile/compare/v1.3.1...v1.3.2) (2025-12-18)


### Bug Fixes

* **components:** add number of selected items. refactor dropdown component to make it reusable ([eafe75b](https://github.com/safety-lens/mobile/commit/eafe75b95e3b543fdfa99940cf118918ff43d979))
* **components:** add search palceholder to multiselect dropdown ([bf8c40e](https://github.com/safety-lens/mobile/commit/bf8c40ebfb54196ba455b5878539e37b913b0be2))
* **dark-theme:** add statusbar color ([d4f9a07](https://github.com/safety-lens/mobile/commit/d4f9a07912dbf6432ba81fbf924eab15522e0d5e))
* **dark-theme:** fix textinput font color in change observation status modal ([af39a82](https://github.com/safety-lens/mobile/commit/af39a829242202b303d11d89b3581d8f07560878))
* **profile:** fix filter menu position to fit the content ([e1b9e5d](https://github.com/safety-lens/mobile/commit/e1b9e5d66fbbafdc6ddd0b33650dc13b2c2889e9))

### [1.3.1](https://github.com/safety-lens/mobile/compare/v1.3.0...v1.3.1) (2025-12-15)


### Bug Fixes

* **components:** add loading state to the reusable button ([19d1ddd](https://github.com/safety-lens/mobile/commit/19d1dddb45a1fc6ea28a45ebe62aa16a4fa43abd))
* **download-report:** add loader to the button ([bc85434](https://github.com/safety-lens/mobile/commit/bc8543466c5b430a302666c87d829943aa9709d9))
* **reports:** copy images from assets to files to fix missing images in headers ([daa8c38](https://github.com/safety-lens/mobile/commit/daa8c38163736ea807edfffe24da1b2fa397ac21))

## [1.3.0](https://github.com/safety-lens/mobile/compare/v1.2.7...v1.3.0) (2025-12-08)


### Features

* **api:** add react-query query for projects to have separated cache per screen ([4be6ea1](https://github.com/safety-lens/mobile/commit/4be6ea13d43ad4f63aef279c83368aa16cfc5c25))
* **components:** add to the dropdown component load more functionality ([8b7bd87](https://github.com/safety-lens/mobile/commit/8b7bd87385272d1ce7f5838bd98d1a4f336e714a))
* **reports:** add logos and slogan to pdf. correct style. refactor pdf generator ([ab2859a](https://github.com/safety-lens/mobile/commit/ab2859ae191e9b8f4606aec7db0515ce18dcbdc1))


### Bug Fixes

* **api:** separate pure requests from side-effects in useProjects hook ([da861b4](https://github.com/safety-lens/mobile/commit/da861b4dfa0c03ff1c861f30832c32356a227ba9))
* **notifications:** replace infinite limit from notifications page with query with load more ([1f6cc8c](https://github.com/safety-lens/mobile/commit/1f6cc8cd9909879096afb41e223d1aaa785c3b35))
* **projects:** add pagination to projects dropdown. use react-query cache ([3a84c77](https://github.com/safety-lens/mobile/commit/3a84c77676dda60f57da7f47d6666fa909b47d56))
* **projects:** replace Main photo with Project map ([8f74913](https://github.com/safety-lens/mobile/commit/8f74913cf7a9dc8d049df42d2f048ffb1155d4c4))
* **queries:** add all props to keys to separate different kinds of projects requests ([b2ae4e5](https://github.com/safety-lens/mobile/commit/b2ae4e5e56fd71da92f8f3baaa47926611ee443a))
* **reports:** add more precise calculations for pdf elements ([a6d1154](https://github.com/safety-lens/mobile/commit/a6d11540ccfddfb31284c809abb4d246a2c73694))
* **reports:** distribute reports content across the pages predicting height ([f735e15](https://github.com/safety-lens/mobile/commit/f735e156b2afd3ae01c295fb164f28fe4c4f034d))

### [1.2.7](https://github.com/safety-lens/mobile/compare/v1.2.6...v1.2.7) (2025-11-03)


### Bug Fixes

* **notifications:** add standard as a default state for importance ([5a14bb7](https://github.com/safety-lens/mobile/commit/5a14bb7615176758653b45112cd3308906735b36))
* **notifications:** disable Send Notification button on submitting ([589b3dc](https://github.com/safety-lens/mobile/commit/589b3dc9b052ea16b7e3209ba61f89b7756bf51d))

### [1.2.6](https://github.com/safety-lens/mobile/compare/v1.2.5...v1.2.6) (2025-10-30)


### Bug Fixes

* **sign-in:** set color to the password field explicitly. fix correction ([20f3b4c](https://github.com/safety-lens/mobile/commit/20f3b4c6e3fc87829650e7301bea8de8b512709f))

### [1.2.5](https://github.com/safety-lens/mobile/compare/v1.2.4...v1.2.5) (2025-10-27)


### Bug Fixes

* **create-observation:** add disclaimer to the bottom of the screen ([c2a59ed](https://github.com/safety-lens/mobile/commit/c2a59ed930169e285f7cae87821c177de75c9b36))
* **reports:** change Share button label ([f6d56df](https://github.com/safety-lens/mobile/commit/f6d56df1dd89f79ea546de3517835fe63fe148e0))

### [1.2.4](https://github.com/safety-lens/mobile/compare/v1.2.3...v1.2.4) (2025-10-22)


### Bug Fixes

* **android:** add basic routes to intent-filters ([a38dabc](https://github.com/safety-lens/mobile/commit/a38dabc1927d080f193a2812657761b423df9451))

### [1.2.3](https://github.com/safety-lens/mobile/compare/v1.2.2...v1.2.3) (2025-10-17)


### Bug Fixes

* **api:** refactor logic. add request queues. cover logic by tests ([2126127](https://github.com/safety-lens/mobile/commit/2126127157d2ab2c70c7e8f98cf9f304062bb8a9))
* **components:** fix datetime picker component to set date and time separately ([2e5da1f](https://github.com/safety-lens/mobile/commit/2e5da1f696d43e0f61994d83bf7479068c60dbac))
* **logout:** hide splashscreen after logout ([2c81df5](https://github.com/safety-lens/mobile/commit/2c81df5d825d6779ef4f8a7d7784f88f388bc876))
* **new-observation:** set default date only if user selected ([02904e6](https://github.com/safety-lens/mobile/commit/02904e66028cb9f9cabb0a1afa2abf537858c91a))
* **projects:** hide deadline if has no in the subscription ([cdcd220](https://github.com/safety-lens/mobile/commit/cdcd2206b467618c22df1a6afaf925c274c089f6))
* **subscription:** move isAdminAdmin to subscription directly due to the isses in user info hook ([c7734a9](https://github.com/safety-lens/mobile/commit/c7734a9da698efa1d838b2a36a98ea1a0a0c4c4d))

### [1.2.2](https://github.com/safety-lens/mobile/compare/v1.2.1...v1.2.2) (2025-10-16)


### Bug Fixes

* **auth:** add back button to the top ([d14d006](https://github.com/safety-lens/mobile/commit/d14d006682983ae8ebbd98232be1f54f20622558))
* **chat:** fix vertical paddings to not cut messages on the top ([3e7717e](https://github.com/safety-lens/mobile/commit/3e7717e62b5e695769d0b3bfc3e14be2400eee3f))
* **components:** make back button padding customizable ([4948517](https://github.com/safety-lens/mobile/commit/494851766a06919f74377729e79a5da9938dbe88))
* **create-observation:** hide chat input if has no access ([57e4fab](https://github.com/safety-lens/mobile/commit/57e4fab37fe3f871883c921963f8163d13e47f62))
* **notifications:** remove error of getting push token ([62fa88a](https://github.com/safety-lens/mobile/commit/62fa88a39f629c9115d050d8aa5b26a83728a3b9))
* **obserrvation-card:** fix styles of show nore button. refactor implementation ([60bc723](https://github.com/safety-lens/mobile/commit/60bc7234ca5990b84843e46939d4d67ad22e7eeb))
* **push-notification:** replace push notifications google service config ([5c88515](https://github.com/safety-lens/mobile/commit/5c88515335f1fe896d879176b4435e17720297da))
* **sign-up:** change text of registration tip ([c600087](https://github.com/safety-lens/mobile/commit/c600087dab8a25994b1fab1bc2183806a42fefd9))
* **start-screen:** centered logo. fix broken svg dimensions ([dbc48a8](https://github.com/safety-lens/mobile/commit/dbc48a87ab3da5089302fcaf807eb81174d06225))

### [1.2.1](https://github.com/safety-lens/mobile/compare/v1.2.0...v1.2.1) (2025-10-15)


### Bug Fixes

* **create-observation:** fix message type for image based observation ([0ec112f](https://github.com/safety-lens/mobile/commit/0ec112f45cf1a7943a62520e29203a6fd4545748))
* **create-observation:** hide choose assignee if has no such feature in subscription ([d4d32e4](https://github.com/safety-lens/mobile/commit/d4d32e4b148ca9bc71b2d0c1c49b3686c006808e))
* **create-project:** hide Project members button if has no access to teamInvitations feature ([4ea8412](https://github.com/safety-lens/mobile/commit/4ea84123a6f8a4e48c5fbe4fe026a62b9435c3e3))
* **observation-action:** hide Change Assignee button if has no in subscription ([83e126a](https://github.com/safety-lens/mobile/commit/83e126acfc477dcf5861ff0a8c028ab6ada6e596))
* **observation-card:** hide assignees if has no access to team invitations ([4c8db91](https://github.com/safety-lens/mobile/commit/4c8db919dacfa01edf210e9359bc8d6b32a68ce2))
* separate image from text. fix image loading condition ([b07f295](https://github.com/safety-lens/mobile/commit/b07f2958344f75cf7c4abae1baca306202b5c647))

## [1.2.0](https://github.com/safety-lens/mobile/compare/v1.1.1...v1.2.0) (2025-10-13)


### Features

* add provider for subscription and subscription features ([5bafab3](https://github.com/safety-lens/mobile/commit/5bafab3db4e4070abee2c4c715c942335a668b3e))
* add subscription modal to restrict access to the app areas ([d51028f](https://github.com/safety-lens/mobile/commit/d51028f09c3e0e9e223e7f19fe66a0d09b31c2ce))
* **chat:** disable input and show modal if not enough permissions ([37f5fad](https://github.com/safety-lens/mobile/commit/37f5fadf1d89c6c1274773950fdcc4bb87181724))
* **components:** add reusable placeholder for screens ([5181a04](https://github.com/safety-lens/mobile/commit/5181a044ed083309e9b85e43c262b3c1e85c66b3))
* **components:** add subscription guard to wrap screen or components ([6e02682](https://github.com/safety-lens/mobile/commit/6e02682617ed8758ae026952e3d4218797b4124b))
* **hooks:** add useModal hook to reduce boilerplates ([cab6208](https://github.com/safety-lens/mobile/commit/cab6208d6769b84bafa49853c1f610b7ce89e739))
* **notifications:** hide button if user cannot create notifications or they not global admin ([4ba7fa6](https://github.com/safety-lens/mobile/commit/4ba7fa6ce60acd426a21ae8845900117a2116f75))
* **profile:** add call ot action if has no access to reports ([a29831f](https://github.com/safety-lens/mobile/commit/a29831faa89a6b8d65f365e4eb485319120866a2))
* **screens:** add guards to all tabs except Profile ([a44460e](https://github.com/safety-lens/mobile/commit/a44460e2c5321193a0e7f2f3692416718b9bf3f3))
* **screens:** set up subscription guard on My project screen ([393fa53](https://github.com/safety-lens/mobile/commit/393fa535a38e5352e62df82ffe20a129d17e2748))
* **screens:** wrap projects with subscription wrapper ([02cf407](https://github.com/safety-lens/mobile/commit/02cf407c4dd3a4adde8ed68d4e1161a536a5059a))


### Bug Fixes

* add loading for user to not redirect to start screen befora data is loaded ([ed2514e](https://github.com/safety-lens/mobile/commit/ed2514ed7abf6890e2021317b6e17c75705247dd))
* add method to check current subscription features. hide members if has no permissions ([d4cb85d](https://github.com/safety-lens/mobile/commit/d4cb85db3e419325803a0ddf4022994bac1b747c))
* add trialing to the list of active statuses ([25c5fc3](https://github.com/safety-lens/mobile/commit/25c5fc37d29195bfda49461400ef6515b3c6fa10))
* **auth:** redirect to projects if has no subscription. do not send requests without subscription ([c876146](https://github.com/safety-lens/mobile/commit/c876146734345c17256e62536fd3eced442f4547))
* **components:** add centered mode to typeography ([7365a9e](https://github.com/safety-lens/mobile/commit/7365a9e6077b5c172b8100db1008bef2a68c5553))
* fix shadow declaration. add rule to show error on shadow declarations ([862df91](https://github.com/safety-lens/mobile/commit/862df9169ed3f93417541cf6ad0777967d92d0fa))
* **observation-card:** replace non-boolean jsx conditions with booleans. tiny refactor ([15c1bec](https://github.com/safety-lens/mobile/commit/15c1bec04a3bdbba5c9369eb4e004e087c7fc433))
* **observations:** fix images recycling ([a58762c](https://github.com/safety-lens/mobile/commit/a58762c2c3736730e0bf50394c833d9d31e70b16))
* **observations:** update list if categories were changed. separate concerns by adding callback ([a59a619](https://github.com/safety-lens/mobile/commit/a59a6196b1d6dde37ebd06c1a4774e1f3585c5ea))
* remove subscription buttons ([95cf922](https://github.com/safety-lens/mobile/commit/95cf9220fbaf6211f293edcb3625a481e24e71d1))
* request accounts data on fices if has no subscription ([7fb2b84](https://github.com/safety-lens/mobile/commit/7fb2b84e72c566dfc6deb4af7b4f53e30837dde5))
* **router:** await user loading befor hiding the splash screen ([44b9387](https://github.com/safety-lens/mobile/commit/44b938700ed9b8b19dae1442d1daddc64f105ab8))
* secure parsing JSON in SubscriptionProvider ([30f5259](https://github.com/safety-lens/mobile/commit/30f52596b3e3bf1a5c0eb4492f0ca5b318430f96))
* **sign-up:** add back button ([3551b4c](https://github.com/safety-lens/mobile/commit/3551b4cdfed197e5807ddd333d0255f9a1b5f8e7))
* specify placeholder color explicitly to fix bug with dark theme ([91667e6](https://github.com/safety-lens/mobile/commit/91667e6b84ff741da81adab09b7e2b97d9208749))
* **typography:** add title style ([97f97c8](https://github.com/safety-lens/mobile/commit/97f97c89dfcfee2bfc944388152ac2ba00a58fe4))

### [1.1.1](https://github.com/safety-lens/mobile/compare/v1.1.0...v1.1.1) (2025-10-03)


### Bug Fixes

* **api:** choose url conditionally base on app variant ([706a1d9](https://github.com/safety-lens/mobile/commit/706a1d938e898f8219bb4fdbf9cb5e755a4dac73))
* **auth:** add placeholders to sign in form ([eff36b8](https://github.com/safety-lens/mobile/commit/eff36b89598985dead20d37ea779c97cea4792ce))
* **auth:** change log in text to sign in ([c781713](https://github.com/safety-lens/mobile/commit/c7817135070764f6b376cabf602adb22b8be3708))
* **auth:** change sigh in header ([8738429](https://github.com/safety-lens/mobile/commit/87384296950e2a8fc41cc1bacc6c6a00d5f04259))
* **env:** replace environment variables with EXPO_PUBLIC ([ce263a0](https://github.com/safety-lens/mobile/commit/ce263a021ce7a5aabe6b317e929a6f9fdc89c17d))

## 1.1.0 (2025-10-02)


### Features

* **components:** add Typography component to reuse text styles ([17d6d24](https://github.com/safety-lens/mobile/commit/17d6d24a1f2f05f936b8278aa2858bceefde8520))


### Bug Fixes

* **auth:** fix button color. replace texts with reusable typography. fix styles ([5070a49](https://github.com/safety-lens/mobile/commit/5070a496cc89e94a4e642db2457c454123b6b954))
* **auth:** fix translations ([43dcd9b](https://github.com/safety-lens/mobile/commit/43dcd9b13dabf73af6e11f750f5654587f3c9f9c))
* **check-email:** remove autocapitalize from email input ([213fbd9](https://github.com/safety-lens/mobile/commit/213fbd9ff662c5acf60ffcc4a829987e51b0eadd))
* **components:** add autoCapitalize and autoComplete flags ([0205125](https://github.com/safety-lens/mobile/commit/0205125237095e2062173c5a23b792281e09f1af))
