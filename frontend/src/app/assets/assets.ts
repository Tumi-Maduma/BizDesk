import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AssetService } from '../services/asset.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-assets',
    imports: [CommonModule, FormsModule],
    templateUrl: './assets.html',
    styleUrl: './assets.css'
})
export class AssetsComponent implements OnInit {

    assets: any[] = [];

    loading = true;

    errorMessage = '';

    showAddForm = false;

    users: any[] = [];

    showAssignForm = false;

    selectedAsset: any = null;

    selectedUserId: number | null = null;

    showEditForm = false;

    editingAssetId: number | null = null;

    constructor(
        private assetService: AssetService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loadAssets();
    }

    loadAssets(): void {

        this.assetService
            .getAssets()
            .subscribe({
                next: (response) => {

                    this.assets = response;

                    this.loading = false;
                },

                error: (error) => {

                    console.error(
                        'Error loading assets:',
                        error
                    );

                    this.errorMessage =
                        'Failed to load assets.';

                    this.loading = false;
                }
            });
    }

    assetForm = {
      name: '',
      asset_type: '',
      serial_number: '',
      brand: '',
      model: '',
      status: 'AVAILABLE',
      assigned_to: null,
      department: '',
      purchase_date: '',
      notes: ''
  };

  resetForm(): void {

      this.assetForm = {
          name: '',
          asset_type: '',
          serial_number: '',
          brand: '',
          model: '',
          status: 'AVAILABLE',
          assigned_to: null,
          department: '',
          purchase_date: '',
          notes: ''
      };
  }

  saveAsset(): void {

    if (!this.assetForm.name || !this.assetForm.asset_type) {

          this.errorMessage =
              'Asset name and asset type are required.';

          return;
      }

      this.assetService
          .createAsset(this.assetForm)
          .subscribe({

              next: (response) => {

                  console.log(
                      'Asset created:',
                      response
                  );

                  this.showAddForm = false;

                  this.resetForm();

                  this.errorMessage = '';

                  this.loadAssets();
              },

              error: (error) => {

                  console.error(
                      'Error creating asset:',
                      error
                  );

                  this.errorMessage =
                      'Failed to create asset.';
              }

          });
    }

    loadUsers(): void {

        this.userService
            .getAssetUsers()
            .subscribe({
                next: (response: any[]) => {

                    this.users = response;

                },

                error: (error: any) => {

                    console.error(
                        'Error loading users:',
                        error
                    );

                }
            });
    }

    openAssignForm(asset: any): void {

        this.selectedAsset = asset;

        this.selectedUserId =
            asset.assigned_to || null;

        this.showAssignForm = true;

        this.loadUsers();
    }

    closeAssignForm(): void {

        this.showAssignForm = false;

        this.selectedAsset = null;

        this.selectedUserId = null;
    }

    assignAsset(): void {

        if (
            !this.selectedAsset ||
            !this.selectedUserId
        ) {

            return;
        }

        this.assetService
            .assignAsset(
                this.selectedAsset.id,
                this.selectedUserId
            )
            .subscribe({

                next: () => {

                    this.closeAssignForm();

                    this.loadAssets();

                },

                error: (error) => {

                    console.error(
                        'Error assigning asset:',
                        error
                    );

                    this.errorMessage =
                        'Failed to assign asset.';
                }

            });
    }

    unassignAsset(asset: any): void {

        const confirmed = confirm(
            `Are you sure you want to unassign ${asset.asset_tag}?`
        );

        if (!confirmed) {
            return;
        }

        this.assetService
            .unassignAsset(asset.id)
            .subscribe({

                next: () => {

                    this.loadAssets();

                },

                error: (error: any) => {

                    console.error(
                        'Error unassigning asset:',
                        error
                    );

                    this.errorMessage =
                        'Failed to unassign asset.';
                }

            });
    }

    openEditForm(asset: any): void {

        this.editingAssetId = asset.id;

        this.assetForm = {
            name: asset.name || '',
            asset_type: asset.asset_type || '',
            serial_number: asset.serial_number || '',
            brand: asset.brand || '',
            model: asset.model || '',
            status: asset.status || 'AVAILABLE',
            assigned_to: asset.assigned_to || null,
            department: asset.department || '',
            purchase_date: asset.purchase_date
                ? asset.purchase_date.substring(0, 10)
                : '',
            notes: asset.notes || ''
        };

        this.showEditForm = true;
    }

    openAddForm(): void {
        this.showAddForm = true;
    }

    closeAddForm(): void {
        this.showAddForm = false;
        this.resetForm();
    }

    closeEditForm(): void {

        this.showEditForm = false;

        this.editingAssetId = null;

        this.resetForm();
    }

    updateAsset(): void {

      if (
          !this.editingAssetId ||
          !this.assetForm.name ||
          !this.assetForm.asset_type ||
          !this.assetForm.status
      ) {

          this.errorMessage =
              'Asset name, asset type and status are required.';

          return;
      }

        this.assetService
          .updateAsset(
              this.editingAssetId,
              this.assetForm
          )
          .subscribe({

              next: () => {

                  this.closeEditForm();

                  this.errorMessage = '';

                  this.loadAssets();

              },

              error: (error: any) => {

                  console.error(
                      'Error updating asset:',
                      error
                  );

                  this.errorMessage =
                      'Failed to update asset.';
              }

          });
      
      }

      deleteAsset(asset: any): void {
        const confirmed = confirm(
            `Are you sure you want to delete ${asset.asset_tag}?`
        );

        if (!confirmed) {
            return;
        }

        this.assetService
            .deleteAsset(asset.id)
            .subscribe({
                next: () => {
                    this.errorMessage = '';
                    this.loadAssets();
                },
                error: (error: any) => {
                    console.error(
                        'Error deleting asset:',
                        error
                    );

                    this.errorMessage =
                        'Failed to delete asset.';
                }
            });
    }
}