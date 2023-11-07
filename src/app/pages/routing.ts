import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'new-dashboard',
    loadChildren: () =>
      import('./new-dashboard/new-dashboard.module').then(
        (m) => m.NewDashboardModule
      ),
  },
  {
    path: 'Admin',
    loadChildren: () =>
      import('./Admin-Acount-pages/admin-acount-pages.module').then(
        (m) => m.AdminAcountPagesModule
      ),
  },
  {
    path: 'Report-management',
    loadChildren: () =>
      import('./report-managment/report-managment.module').then(
        (m) => m.ReportManagmentModule
      ),
  },
  {
    path: 'WorkOrder-Parts-Transaction',
    loadChildren: () =>
      import(
        './work-order-parts-transaction/work-order-parts-transaction.module'
      ).then((m) => m.WorkOrderPartsTransactionModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'UnderConstruction',
    loadChildren: () =>
      import('./UnderConstruction/UnderConstruction.module').then(
        (m) => m.UnderConstructionModule
      ),
  },
  {
    path: 'Asset',
    loadChildren: () =>
      import('./assetsScreen/assetsScreen.module').then(
        (m) => m.assetsScreenModule
      ),
  },
  {
    path: 'MaintenanceRequests',
    loadChildren: () =>
      import('./maintenance-requests/maintenance-requests.module').then(
        (m) => m.MaintenanceRequestsModule
      ),
  },
  {
    path: 'Bills',
    loadChildren: () =>
      import('./bills/bills.module').then((m) => m.BillsModule),
  },
  {
    path: 'ProcurementManagement',
    loadChildren: () =>
      import('./procurement-management/procurement-management.module').then(
        (m) => m.ProcurementManagementModule
      ),
  },

  {
    path: 'WorkOrder',
    loadChildren: () =>
      import('./work-order/workOrder.module').then((m) => m.workOrderModule),
  },
  {
    path: 'WorkOrderTemplate',
    loadChildren: () =>
      import('./TemplatesForSop/TemplatesForSop.module').then(
        (m) => m.SOPTemplateModule
      ),
  },
  {
    path: 'PMs',
    loadChildren: () => import('./pms/pms.module').then((m) => m.PMsModule),
  },
  {
    path: 'page-no-permission',
    loadChildren: () =>
      import('../pages/page-no-permission/page-no-permission.module').then(
        (m) => m.PageNoPermissionModule
      ),
  },
  {
    path: 'page-welcome',
    loadChildren: () =>
      import('../pages/Welcome-page/Welcome-page.module').then(
        (m) => m.WelcomePageModule
      ),
  },
  {
    path: 'Vendors',
    loadChildren: () =>
      import('./vendors/vendors.module').then((m) => m.VendorsModule),
  },
  {
    path: 'AccidentReport',
    loadChildren: () =>
      import('./accident-reports/accident-reports.module').then(
        (m) => m.AccidentReportsModule
      ),
  },
  {
    path: 'Report-management/event-clasification',
    loadChildren: () =>
      import(
        './event-reporting-classification/event-reporting-classification.module'
      ).then((m) => m.EventReportingClassificationModule),
  },
  {
    path: 'IssueReporting',
    loadChildren: () =>
      import('./event-reporting/event-reporting.module').then(
        (m) => m.EventReportingModule
      ),
  },
  {
    path: 'AquestionnaireCmms',
    loadChildren: () =>
      import('./aquestionnaire-cmms/aquestionnaire-cmms.module').then(
        (m) => m.AquestionnaireCmmsModule
      ),
  },
  {
    path: 'PPMTasks',
    loadChildren: () =>
      import('./ppm-tasks/ppm-tasks.module').then((m) => m.PPMTasksModule),
  },
  // {
  //   path: 'Backup',
  //   loadChildren: () =>
  //     import('./Backup/Backup.module').then((m) => m.BackupModule),
  // },
  // {
  //   path: 'FilesBackup',
  //   loadChildren: () =>
  //     import('./FilesBackup/FilesBackup.module').then(
  //       (m) => m.FilesBackupModule
  //     ),
  // },
  {
    path: 'All-Notifications',
    loadChildren: () =>
      import('./all-notifications/all-notifications.module').then(
        (m) => m.AllNotificationsModule
      ),
  },
  {
    path: 'Stores',
    loadChildren: () =>
      import('./stores/spare-parts.module').then((m) => m.StoresModule),
  },

  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'workerDashboard',
    loadChildren: () =>
      import('./worker-dashboard/worker-dashboard.module').then(
        (m) => m.WorkerDashboardModule
      ),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },

  // {
  //   path: 'configurations', // <= Page URL
  //   component: ConfigurationsComponent // <= Page component registration
  // },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

export { Routing };
