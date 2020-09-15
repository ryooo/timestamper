class Users::PasswordsController < Devise::PasswordsController
  layout "no_authentication"
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  def create
    jsonps = []
    if recaptcha_valid?
      self.resource = resource_class.send_reset_password_instructions(resource_params)

      if successfully_sent?(resource)
        jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, template: :"devise/sessions/new"))
        jsonps << Jsonp::AddFlashMessage.new("メールを送信しました。", :notice)
      else
        params[:show_checkbox_recaptcha] = true
        jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :new))
        jsonps << Jsonp::AddFlashMessage.new(fetch_first_validation_error(resource))
      end
    else
      params[:show_checkbox_recaptcha] = true
      jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :new))
      jsonps << Jsonp::AddFlashMessage.new("ロボットによるアクセスではないことを証明できませんでした。<br>もう一度送信してください。")
    end
    render_jsonps(jsonps)
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    jsonps = []
    if recaptcha_valid?
      self.resource = resource_class.reset_password_by_token(resource_params)

      if resource.errors.empty?
        resource.unlock_access! if unlockable?(resource)
        jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, template: :"devise/sessions/new"))
        jsonps << Jsonp::AddFlashMessage.new("パスワードを再設定しました。", :notice)
      else
        set_minimum_password_length
        jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :edit))
        jsonps << Jsonp::AddFlashMessage.new(fetch_first_validation_error(resource))
      end
    else
      params[:show_checkbox_recaptcha] = true
      jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :edit))
      jsonps << Jsonp::AddFlashMessage.new("ロボットによるアクセスではないことを証明できませんでした。<br>もう一度送信してください。")
    end

    render_jsonps(jsonps)
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
