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

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, only: [
    :index,
    :edit,
  ]
  scope :dashboard, as: :dashboard do
    get "index" => "dashboard#index"
    get "stamp" => "dashboard#stamp"
    post "stamp" => "dashboard#stamp"
  end
  resources :dashboard, only: [
    :index,
  ]
  scope :stamp, as: :stamp do
    get "/" => "stamps#execute"
    post "/" => "stamps#execute"
    post "update" => "stamps#update"
  end
end
