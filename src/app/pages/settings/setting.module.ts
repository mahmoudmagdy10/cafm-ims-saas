import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: 'my-profile',
            loadChildren: () =>
              import('./my-profile/my-profile.module').then(
                (m) => m.MyProfileModule
              ),
          },
          {
            path: 'configurations',
            loadChildren: () =>
              import('./configurations/configurations.module').then(
                (m) => m.ConfigurationsModule
              ),
          },

          {
            path: 'roles',
            loadChildren: () =>
              import('./roles/roles.module').then((m) => m.RolesModule),
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./users/users.module').then((m) => m.usersModule),
          },
          {
            path: 'locations',
            loadChildren: () =>
              import('./locations/locations.module').then(
                (m) => m.locationsModule
              ),
          },
          {
            path: 'Subscription',
            loadChildren: () =>
              import('./Subscription/Subscription.module').then(
                (m) => m.SubscriptionModule
              ),
          },
          {
            path: 'Subscription/:id',
            loadChildren: () =>
              import('./Subscription/Subscription.module').then(
                (m) => m.SubscriptionModule
              ),
          },
          {
            path: 'CompaniesTeams',
            loadChildren: () =>
              import('./CompaniesTeams/CompaniesTeams.module').then(
                (m) => m.CompaniesTeamsModule
              ),
          },
          {
            path: 'trash',
            loadChildren: () =>
              import('./trash/trash.module').then((m) => m.trashModule),
          },

          { path: '', redirectTo: 'hostDashboard', pathMatch: 'full' },
          { path: '**', redirectTo: 'hostDashboard' },
        ],
      },
    ]),
  ],
  declarations: [],
  exports: [],
})
export class SettingModule {}
