Holidays.between(Date.civil(2020, 1, 1), 2.years.from_now, :jp, :observed).map do |holiday|
  BusinessTime::Config.holidays << holiday[:date]
  # Implement long weekends if they apply to the region, eg:
  # BusinessTime::Config.holidays << holiday[:date].next_week if !holiday[:date].weekday?
end

require 'holidays/core_extensions/date'
class Date
  include Holidays::CoreExtensions::Date
end

class Date
  def holiday_name
    self.holidays(:jp).first.try(:[], :name).dup
  end

  def first_business_day_of_week?
    this_monday = self - (self.wday - 1)
    first_workday_diff = (0..5).detect {|i| (this_monday + i.days).workday? }
    return false if first_workday_diff.nil?
    self == (this_monday + first_workday_diff.days)
  end
end
