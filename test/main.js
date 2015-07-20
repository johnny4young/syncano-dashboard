import 'babel-core/polyfill';

import './apps/Account/AccountActivate.react';
import './apps/Account/AccountLogin.react';
import './apps/Account/AccountPasswordReset.react';
import './apps/Account/AccountPasswordResetConfirm.react';
import './apps/Account/AccountPasswordUpdate.react';
import './apps/Account/AccountSignup.react';
import './apps/Account/AuthActions';
import './apps/Account/AuthConstants';
import './apps/Account/AuthStore';
import './apps/Account/Hello';
import './apps/Admins/AdminDialog.react';
import './apps/Admins/AdminDialogStore';
import './apps/Admins/Admins.react';
import './apps/Admins/AdminsActions';
import './apps/Admins/AdminsInvitationsActions';
import './apps/Admins/AdminsInvitationsStore';
import './apps/Admins/AdminsList.react';
import './apps/Admins/AdminsStore';
import './apps/ApiKeys/ApiKeyDialog.react';
import './apps/ApiKeys/ApiKeyDialogStore';
import './apps/ApiKeys/ApiKeys.react';
import './apps/ApiKeys/ApiKeysActions';
import './apps/ApiKeys/ApiKeysList.react';
import './apps/ApiKeys/ApiKeysStore';
import './apps/Classes/ClassDialog.react';
import './apps/Classes/ClassDialogStore';
import './apps/Classes/Classes.react';
import './apps/Classes/ClassesActions';
import './apps/Classes/ClassesList.react';
import './apps/Classes/ClassesStore';
import './apps/CodeBoxes/CodeBoxDialog.react';
import './apps/CodeBoxes/CodeBoxDialogStore';
import './apps/CodeBoxes/CodeBoxes.react';
import './apps/CodeBoxes/CodeBoxesActions';
import './apps/CodeBoxes/CodeBoxesConfig.react';
import './apps/CodeBoxes/CodeBoxesEdit.react';
import './apps/CodeBoxes/CodeBoxesList.react';
import './apps/CodeBoxes/CodeBoxesStore';
import './apps/DataObjects/CheckAvatar.react';
import './apps/DataObjects/ColumnsFilterMenu.react';
import './apps/DataObjects/DataObjectDialog.react';
import './apps/DataObjects/DataObjectDialogStore';
import './apps/DataObjects/DataObjects.react';
import './apps/DataObjects/DataObjectsActions';
import './apps/DataObjects/DataObjectsRenderer';
import './apps/DataObjects/DataObjectsStore';
import './apps/Header/Header.react';
import './apps/Header/HeaderActions';
import './apps/Header/HeaderInstancesDropdown.react';
import './apps/Header/HeaderMenu.react';
import './apps/Header/HeaderMixin';
import './apps/Header/HeaderNotificationsDropdown.react';
import './apps/Header/HeaderOptions.react';
import './apps/Header/HeaderStore';
import './apps/Header/InvitationsMenuItem.react';
import './apps/Instances/InstanceDialog.react';
import './apps/Instances/InstanceDialogStore';
import './apps/Instances/Instances.react';
import './apps/Instances/InstancesActions';
import './apps/Instances/InstancesList.react';
import './apps/Instances/InstancesListHeader.react';
import './apps/Instances/InstancesListItem.react';
import './apps/Instances/InstancesListWithHeader.react';
import './apps/Instances/InstancesStore';
import './apps/Profile/ProfileActions';
import './apps/Profile/ProfileAuthentication.react';
import './apps/Profile/ProfileAuthenticationStore';
import './apps/Profile/ProfileBilling.react';
import './apps/Profile/ProfileInvitations.react';
import './apps/Profile/ProfileInvitationsActions';
import './apps/Profile/ProfileInvitationsStore';
import './apps/Profile/ProfileSettings.react';
import './apps/Profile/ProfileSettingsStore';
import './apps/Session/Connection';
import './apps/Session/SessionActions';
import './apps/Session/SessionMixin';
import './apps/Session/SessionStore';
import './apps/Tasks/ScheduleDialog.react';
import './apps/Tasks/ScheduleDialogStore';
import './apps/Tasks/SchedulesActions';
import './apps/Tasks/SchedulesList.react';
import './apps/Tasks/SchedulesStore';
import './apps/Tasks/Tasks.react';
import './apps/Tasks/TriggerDialog.react';
import './apps/Tasks/TriggerDialogStore';
import './apps/Tasks/TriggersActions';
import './apps/Tasks/TriggersList.react';
import './apps/Tasks/TriggersStore';
import './apps/Traces/Traces.react';
import './apps/Traces/TracesActions';
import './apps/Traces/TracesList.react';
import './apps/Traces/TracesStore';
import './apps/Users/GroupDialog.react';
import './apps/Users/GroupDialogStore';
import './apps/Users/GroupsActions';
import './apps/Users/GroupsList.react';
import './apps/Users/GroupsStore';
import './apps/Users/UserDialog.react';
import './apps/Users/UserDialogStore';
import './apps/Users/Users.react';
import './apps/Users/UsersActions';
import './apps/Users/UsersList.react';
import './apps/Users/UsersStore';
import './apps/Webhooks/Webhooks.react';
import './common/ActivationView';
import './common/ContentHeader.react';
import './common/ContentTraces.react';
import './common/Spacing';
import './common/SyncanoTheme';
import './common/UsageBar.react';
import './common/Accordion/Accordion.react';
import './common/Accordion/AccordionListItemPrimary.react';
import './common/Accordion/AccordionListItemSecondary.react';
import './common/AvatarInitials/AvatarInitials.react';
import './common/Button/ButtonExpandToggle.react';
import './common/Button/ButtonGroup.react';
import './common/Calendar/Calendar.react';
import './common/CheckIcon/CheckIcon.react';
import './common/Color/ColorStore';
import './common/ColorIconPicker/ColorIconPicker.react';
import './common/ColorIconPicker/ColorIconPickerDialog.react';
import './common/ColumnList/ColName.react';
import './common/ColumnList/ColNameDesc.react';
import './common/ColumnList/ColumnListConstans';
import './common/ColumnList/EmptyListItem.react';
import './common/ColumnList/Header.react';
import './common/ColumnList/Item.react';
import './common/ColumnList/ItemColumn.react';
import './common/ColumnList/Column/CheckIcon.react';
import './common/ColumnList/Column/Date.react';
import './common/ColumnList/Column/Desc.react';
import './common/ColumnList/Column/IconName.react';
import './common/ColumnList/Column/ID.react';
import './common/ColumnList/Column/Key.react';
import './common/ColumnList/Column/Name.react';
import './common/ColumnList/Column/Text.react';
import './common/Container/Container.react';
import './common/Dropdown/Dropdown.react';
import './common/Dropdown/DropdownMenuButton.react';
import './common/Dropdown/DropdownMenuItem.react';
import './common/Dropdown/DropdownMenuItemToggle.react';
import './common/Dropdown/DropdownMenuSection.react';
import './common/Dropdown/DropdownNotifiItem.react';
import './common/Dropdown/DropdownWithButtons.react';
import './common/Dropdown/MaterialDropdown.react';
import './common/Dropdown/MaterialDropdownItem.react';
import './common/Editor/Editor.react';
import './common/Editor/EditorPanel.react';
import './common/Fab/FabList.react';
import './common/Fab/FabListItem.react';
import './common/Field/Field.react';
import './common/Field/FieldDatetime.react';
import './common/Field/FieldList.react';
import './common/Field/FieldPassword.react';
import './common/Field/FieldReadonly.react';
import './common/Field/FieldSelect.react';
import './common/Field/FieldSelectOption.react';
import './common/Icon/IconStore';
import './common/Icon/RoundIcon.react';
import './common/Label/Label.react';
import './common/Lists/List.react';
import './common/Lists/ListContainer.react';
import './common/Lists/ListHeader.react';
import './common/Lists/ListItem.react';
import './common/Lists/ListItemColumns.react';
import './common/Lists/ListItemEmpty.react';
import './common/Lists/Lists.react';
import './common/Lists/ListWithOptions.react';
import './common/Loading/Loading.react';
import './common/Logo/Logo.react';
import './common/Notification/Notification.react';
import './common/ProgressBar/ProgressBar.react';
import './common/Search/Search.react';
import './common/Show/Show.react';
import './common/SnackBar/Snackbar';
import './common/SocialAuthButtonsList/SocialAuthButtonsList.react';
import './common/SwitchField/SwitchField.react';
import './common/SwitchField/SwitchFieldList.react';
import './common/SwitchField/SwitchInput.react';
import './common/Table/Table.react';
import './common/Table/TableBody.react';
import './common/Table/TableData.react';
import './common/Table/TableHeader.react';
import './common/Table/TableHeaderData.react';
import './common/Table/TableRow.react';
import './common/Tabs/Tabs.react';
import './common/Trace/TraceResult.react';
import './common/Trace/TraceResultWithMeta.react';
import './common/UsageBar/UsageBar.react';
import './mixins/ButtonActionMixin';
import './mixins/CheckListStoreMixin';
import './mixins/DialogMixin';
import './mixins/DialogsMixin';
import './mixins/DialogStoreMixin';
import './mixins/FormMixin';
import './mixins/InstanceTabsMixin';
import './mixins/mixins';
import './mixins/StoreFormMixin';
import './mixins/StoreLoadingMixin';
import './mixins/WaitForStoreMixin';
import './pages/app.react';
import './pages/dashboard.react';
import './pages/instance.react';
import './pages/notfound.react';
import './utils/MUIContext';
import './utils/ReactRouterContext';