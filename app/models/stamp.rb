class Stamp < ActiveRecord::Base
  def self.find_active_stamp(user, date = nil)
    date ||= Date.today
    self.find_by(user_id: user.id, in_on: date, out_at: nil)
  end

  def self.find_by_user_and_in_on(user, date)
    self.where(user_id: user.id, in_on: date)
  end

  def sec
    ((out_at || Time.current) - in_at)
  end

  def active?
    self.out_at.nil?
  end

  def out(time)
    self.out_at = time
  end

  def as_json(options = {})
    h = super({
      except: [:organization_id, :updated_at, :created_at],
    }.merge(options))
    h[:type] = self.class.name.split("::").last.downcase
    h
  end
end
