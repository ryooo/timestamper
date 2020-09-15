class Users::RegistrationsController < Devise::RegistrationsController
  layout "no_authentication"
  before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    jsonps = []
    if recaptcha_valid?
      build_resource(sign_up_params)
      begin
        ActiveRecord::Base.transaction do
          @organization = Organization.create(name: params[:organization_name])
          resource.organization_code = @organization.code
          resource.save(context: :create_loginable_user)
          raise ActiveRecord::Rollback unless resource.persisted? && @organization&.persisted?
        end
      rescue ActiveRecord::Rollback => e
        nil
      end

      if resource.persisted? && @organization&.persisted?
        if resource.active_for_authentication?
          sign_up(resource_name, resource)
          return redirect_to after_sign_up_path_for(resource)
        else
          expire_data_after_sign_in!
        end
      end
      params[:show_checkbox_recaptcha] = true
      jsonps.unshift(Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :new)))
      jsonps << Jsonp::AddFlashMessage.new("登録時にエラーがありました。")
    else
      params[:show_checkbox_recaptcha] = true
      jsonps.unshift(Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :new)))
      jsonps << Jsonp::AddFlashMessage.new("ロボットによるアクセスではないことを証明できませんでした。<br>もう一度送信してください。")
    end
    render_jsonps(jsonps)
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private

  def after_sign_up_path_for(resource)
    users_path
  end
end
