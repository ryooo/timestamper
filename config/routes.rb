Rails.application.routes.draw do
  root to: "users#index"

  devise_for :users, :controllers => {
    :registrations => 'users/registrations',
    :sessions => 'users/sessions',
    :passwords => 'users/passwords',
  } 

  devise_scope :user do
    get "sign_in", :to => "users/sessions#new"
    get "sign_out", :to => "users/sessions#destroy" 
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, only: [
    :index,
    :show,
    :edit,
  ]
end
