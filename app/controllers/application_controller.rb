class ApplicationController < ActionController::Base

  def redirect_to(url = {}, options = {})
    options[:turbolinks] = :advance unless options.key?(:turbolinks)
    super(url, options)
  end

  private 

  def render_jsonps(jsonps)
    render json: jsonps.map {|jsonp| render_to_string(jsonp.to_h)}.join("\n")
  end

  def recaptcha_valid?
    success = !Rails.env.development?
    success ||= verify_recaptcha(action: 'password_reset', minimum_score: 0.5, secret_key: Settings.google.recaptcha.v3.secret_key)
    checkbox_success = verify_recaptcha(secret_key: Settings.google.recaptcha.v2.secret_key) unless success

    Rails.logger.info("reCAPTCHA: v3: #{success}, v2: #{checkbox_success}")
    return (success || checkbox_success)
  end

  def fetch_first_validation_error(resource)
    key = resource.errors.keys.first
    "#{resource.class.human_attribute_name(key)}#{resource.errors[key].first}"
  end

  def set_current
    @current = Current.new
    @current.update_current_session!(params, session)
  end
end
