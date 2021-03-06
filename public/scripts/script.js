'use strict';

$(() => {

  function Project(project) {
    for (let key in project) {
      this[key] = project[key];
    }
  }

  Project.prototype.toHtml = function () {
    return (Handlebars.compile($('#project-template').html()))(this);
  }

  const populateProjects = data => data.forEach(project => $('#projects-div').append((new Project(project)).toHtml()));

  if (window.localStorage.projects) {
    populateProjects(JSON.parse(window.localStorage.getItem('projects')));
  } else {
    $.getJSON('./scripts/project-data.json', data => {
      populateProjects(data);
      window.localStorage.setItem('projects', JSON.stringify(data));
    });
  }

  $('.thumb').on('mousemove', (e) => {
    $('#tooltip').stop().fadeIn(200).css('opacity', .9)
    .text(e.currentTarget.parentNode.parentNode.childNodes[3].textContent)
    .css({ 'left': `${e.pageX}px`, 'top': `${e.pageY - 20}px` });
  });

  $('.thumb').on('mouseout', () => $('#tooltip').fadeOut(300).css('opacity', .0));

  $('#github-icon').on('click', () =>
    $.get(`/github/user/repos`).then(data =>
      data.forEach(item =>
        $('#repo-container').append(`<li><a href="${item.html_url}">${item.name}</a></li>`)
      )));
});
