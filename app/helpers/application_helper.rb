module ApplicationHelper
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
