class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
  end

  def update
    user = User.find(params[:id])
    user.name = params[:name].strip_all_space_and_empty_to_nil
    user.email = params[:email].strip_all_space_and_empty_to_nil
    user.save
    render_jsonps([
      Jsonp::ShowModal.new(render_to_string(layout: nil)),
    ])
  end

  def show
    render_jsonps([
      Jsonp::ShowModal.new(render_to_string(layout: nil)),
    ])
  end
end
