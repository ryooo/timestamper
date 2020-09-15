class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, authentication_keys: [:organization_code, :email]
    #, :omniauthable, omniauth_providers:[:twitter]

  include ColorColumn
  include EnumMethodGenerator
  enum_methods :user_type, :notification_type
  serialize :position_ids

  validates_presence_of :name
  validates_length_of :name, maximum: 10

  with_options on: :create_loginable_user do |registration|
    registration.validates_presence_of :email
    registration.validates_uniqueness_of :email, scope: :organization_code, case_sensitive: true
    registration.validates_format_of :email, with: Devise.email_regexp, allow_blank: true

    registration.validates_presence_of :password
    registration.validates_confirmation_of :password
    registration.validates_length_of :password, within: Devise.password_length
  end

  def organization
    @organization ||= Organization.find_by(code: self.organization_code)
  end

  def self.reset_password_keys
    [:organization_code, :email]
  end

  def self.find_for_authentication(warden_conditions)
    conditions = warden_conditions.dup
    organization_code = conditions.delete(:organization_code)
    email = conditions.delete(:email)
    if organization_code && email
      where(organization_code: warden_conditions[:organization_code], email: warden_conditions[:email]).first
    elsif email
      where(email: warden_conditions[:email]).first
    else
      raise "find_for_authentication condition error: #{warden_conditions}"
    end
  end
end
