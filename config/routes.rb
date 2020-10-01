Rails.application.routes.draw do

  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions',
    passwords: 'users/passwords',
  } 

  devise_scope :user do
    get "sign_in", to: "users/sessions#new"
    get "sign_out", to: "users/sessions#destroy" 
  end

  scope :users, as: :users do
    get "/" => "users#index"
    get "/:id" => "users#show"
    post "update" => "users#update"
  end
  scope :dashboard, as: :dashboard do
    get "index" => "dashboard#index"
    get "stamp" => "dashboard#stamp"
    post "stamp" => "dashboard#stamp"
  end
  resources :dashboard, only: [
    :index,
  ]
  scope :timeframes, as: :timeframes do
    get "/" => "timeframes#index"
    post "update" => "timeframes#update"
  end
end
