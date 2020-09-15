class Current
  attr_accessor :values
  def update_current_session!(params, session)
    @values = (session[:current] || {}).with_indifferent_access
    params.each do |k, v|
      key = k.to_sym
      case key
      when :controller, :action
        @values[key] = v =~ /^[0-9A-Za-z]+$/ ? v : nil
      when :scope
        @values[key] = [:organization, :location, :user].include?(v&.to_sym) ? v : nil
      when :term
        @values[key] = [:month, :week].include?(v&.to_sym) ? v : nil
      when :target_date
        @values[key] = Date.parse(v).to_s(:y_m_d) rescue Date.today.to_s(:y_m_d)
      when :start_date
        @values[key] = Date.parse(v).to_s(:y_m_d) rescue Date.today.to_s(:y_m_d)
      when :end_date
        @values[key] = Date.parse(v).to_s(:y_m_d) rescue Date.today.to_s(:y_m_d)
      end
    end
    session[:current] = @values
  end

  def controller
    @values[:controller]&.to_sym
  end

  def action
    @values[:action]&.to_sym
  end

  def scope
    (@values[:scope] || :user).to_sym
  end

  def term
    (@values[:term] || :month).to_sym
  end

  def target_date
    @target_date ||= Date.parse(@values[:target_date]) rescue Date.today
  end

  def start_date
    @start_date ||= Date.parse(@values[:start_date]) rescue Date.today
  end

  def end_date
    e = Date.parse(@values[:end_date])
    if e < start_date || (start_date + 50) < e
      Date.today
    else
      e
    end
  end

  def term_start_date
    case self.term
    when :day
      target_date
    when :week
      (target_date + 1.day).beginning_of_week - 1.day
    else
      target_date.beginning_of_month
    end
  end

  def term_end_date
    case self.term
    when :day
      target_date
    when :week
      (target_date + 1.day).end_of_week - 1.day
    else
      target_date.end_of_month
    end
  end

  def to_h
    {
      controller: self.controller,
      action: self.action,
      scope: self.scope,
      date_range: {
        term: self.term,
        target_date: self.target_date.to_s(:y_m_d),
        start_date: self.start_date.to_s(:y_m_d),
        end_date: self.end_date.to_s(:y_m_d),
        term_start_date: self.term_start_date.to_s(:y_m_d),
        term_end_date: self.term_end_date.to_s(:y_m_d),
      },
      user: {
        role: :organization,
      },
      filter: {},
    }
  end
end