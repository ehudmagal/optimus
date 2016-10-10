require 'admin_gui/admin_gui'
require 'mobile_navigator_gui/mobile_navigator_gui'
Rails.application.routes.draw do
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  get '/admin/users/sign_in' => redirect('/users/sign_in')
  get '/mobile_navigator/users/sign_in' => redirect('/users/sign_in')
  mount AdminGui => '/admin'
  mount MobileNavigatorGui => '/mobile_navigator'
  root 'main#index'
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  resources :users do
    collection do
      get "num_of_closed_bids_with_user", defaults: {format: :json}
    end
  end
  resources :bids
  resources :orders do
    collection do
      get "user_index", defaults: {format: :json}
    end
  end



end
