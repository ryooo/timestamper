class Users::SessionsController < Devise::SessionsController
  layout "no_authentication"
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    if self.resource = warden.authenticate(auth_options)
      sign_in(resource_name, resource)
      redirect_to after_sign_in_path_for(resource)
    else
      render_jsonps([
        Jsonp::AddFlashMessage.new("メールアドレスかパスワードに誤りがあります。"),
      ])
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private

  def after_sign_in_path_for(resource)
    dashboard_index_path
  end

  def after_sign_out_path_for(resource)
    new_user_session_path
  end
end
