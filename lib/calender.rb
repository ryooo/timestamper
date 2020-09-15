class Calender
  def self.generate(date: nil, term: :month)
    date ||= Date.today
    case term
    when :week
      [self.generate_week(date)]
    else
      self.generate_month(date)
    end
  end

  def self.generate_month(date)
    ret = []
    d = date.beginning_of_month
    while d <= date.end_of_month
      ret << self.generate_week(d)
      d += 7
    end
    ret
  end

  def self.generate_week(date)
    sunday = date - date.wday.days
    (0..6).map { |e| sunday + e.days }
  end
end