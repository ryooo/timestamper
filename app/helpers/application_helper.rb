module ApplicationHelper
  def time_hm(sec)
    if sec > 1.hour.to_i
      Time.at(sec).utc.strftime("%-H時間 %-M分")
    else
      Time.at(sec).utc.strftime("%-M分")
    end
  end
  
  def timeframe_style(timeframe, date)
    range = Timeframe.current_range(date)
    left = timeframe_margin(timeframe.in_at, range.begin)
    right = timeframe_margin(range.end, timeframe.out_at)
    #right = [right, 100 - left - 7].min
    return "margin-left: #{left}%; margin-right: #{right}%;"
  end

  def timeframe_margin(left, right)
    right ||= Time.current
    [0, left.to_i - right.to_i].max / 864.to_f
  end

  def calender_color_class(str_or_date)
    case str_or_date
    when Date
      case str_or_date.wday
      when 0
        :red
      when 6
        :blue
      else
        str_or_date.holiday_name.nil? ? nil : :red
      end
    when '日'
      :red
    when '土'
      :blue
    end
  end

  def validate_error_tag(object, colomn_name, field_tag)
    if object&.errors.present? && (errors = object.errors[colomn_name])
      field_tags = [field_tag]
      field_tags += errors.map do |error|
        content_tag(:div, class: "validate-error-message") do
          raw('<i class="fas fa-exclamation-triangle"></i>' + "#{object.class.human_attribute_name(colomn_name)}#{error}".html_safe)
        end
      end
      content_tag(:div, class: "field_with_errors") do
        raw(field_tags.join)
      end
    else
      field_tag
    end
  end
end
