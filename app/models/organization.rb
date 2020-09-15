class Organization < ActiveRecord::Base
  include ColorColumn
  include EnumMethodGenerator
  enum_methods :payment_type,
    :forum_type,
    :notification_type,
    :shift_private_type,
    :shift_reminder_type,
    :request_type,
    :request_private_type,
    :timesheet_type,
    :timesheet_start_time_round_type,
    :timesheet_end_time_round_type

  validates_presence_of :name
  validates_length_of :name, maximum: 10
  before_create :generate_code

  def locations
    @locations ||= Location.where(organization_id: self.id) || []
  end

  def positions
    @positions ||= Position.where(organization_id: self.id) || []
  end

  def users
    @users ||= User.where(organization_code: self.code) || []
  end

  def schedules_by_range(from, to)
    Schedule.where(organization_id: self.id) || []
  end

  def generate_code
    self.code ||= Digest::SHA1.hexdigest(self.id.to_s + "SALT_ICED_COFFEE")[-8..-1]
  end

  def trial?
    self.trial_end_at >= Time.current
  end

  def trial_rest_str
    return nil unless self.trial?

    time_diff = TimeDifference.between(self.trial_end_at, Time.current)
    if time_diff.in_minutes.ceil < 60
      "#{time_diff.in_minutes.ceil}分"
    elsif time_diff.in_hours.ceil < 24
      "#{time_diff.in_hours.ceil}時間"
    else
      "#{time_diff.in_days.ceil}日"
    end
  end

  def trial_end_at
    read_attribute(:trial_end_at) || (self.created_at + 14.days)
  end
end
