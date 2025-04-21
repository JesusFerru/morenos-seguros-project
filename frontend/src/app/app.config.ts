import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideFuse } from '@fuse';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { catchError, firstValueFrom, of } from 'rxjs';
import { TranslocoHttpLoader } from './shared/infrastructure/helpers/transloco/transloco.http-loader';
import { provideIcons } from './shared/infrastructure/helpers/icons/icons.provider';
import { provideAuth } from './shared/infrastructure/interceptors/auth.provider';


export const appConfig: ApplicationConfig = {
  providers: [
      provideHttpClient(withFetch()),
      provideAnimationsAsync(),
      provideRouter(appRoutes,
          withPreloading(PreloadAllModules),
          withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
      ),

      // Material Date Adapter
      {
          provide : DateAdapter,
          useClass: LuxonDateAdapter,
      },
      {
          provide : MAT_DATE_FORMATS,
          useValue: {
              parse  : {
                  dateInput: 'D',
              },
              display: {
                  dateInput         : 'DDD',
                  monthYearLabel    : 'LLL yyyy',
                  dateA11yLabel     : 'DD',
                  monthYearA11yLabel: 'LLLL yyyy',
              },
          },
      },

      // Transloco Config
      provideTransloco({
          config: {
              availableLangs      : [
                  {
                      id   : 'en',
                      label: 'English',
                  },
                  {
                      id   : 'tr',
                      label: 'Turkish',
                  },
              ],
              defaultLang         : 'en',
              fallbackLang        : 'en',
              reRenderOnLangChange: true,
              prodMode            : true,
          },
          loader: TranslocoHttpLoader,
      }),
      {
          // Preload the default language before the app starts to prevent empty/jumping content
          provide   : APP_INITIALIZER,
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          useFactory: () => {
            const translocoService = inject(TranslocoService);
            const defaultLang = translocoService.getDefaultLang();
            translocoService.setActiveLang(defaultLang);

            return () =>
                firstValueFrom(translocoService.load(defaultLang), {
                    defaultValue: null
                });

        },
          multi     : true,
      },

      // Fuse
      provideAuth(),
      provideIcons(),
      provideFuse({
          fuse   : {
              layout : 'classy',
              scheme : 'light',
              screens: {
                  sm: '600px',
                  md: '960px',
                  lg: '1280px',
                  xl: '1440px',
              },
              theme  : 'theme-default',
              themes : [
                  {
                      id  : 'theme-default',
                      name: 'Default',
                  },
                  {
                      id  : 'theme-brand',
                      name: 'Brand',
                  },
                  {
                      id  : 'theme-teal',
                      name: 'Teal',
                  },
                  {
                      id  : 'theme-rose',
                      name: 'Rose',
                  },
                  {
                      id  : 'theme-purple',
                      name: 'Purple',
                  },
                  {
                      id  : 'theme-amber',
                      name: 'Amber',
                  },
              ],
          },
      }),
  ],
};
