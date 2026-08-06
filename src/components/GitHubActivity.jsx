import { useEffect, useRef, useState, useCallback } from 'react'
import { useTilt } from '../hooks/useTilt'
import './GitHubActivity.css'

const GITHUB_USER = 'shivamsharma0906'
const GITHUB_API  = `https://api.github.com/users/${GITHUB_USER}`

function useReveal(ref, threshold = 0.1) {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref?.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return vis
}

/* Language color map */
const LANG_COLORS = {
  Python:     '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  'C++':      '#f34b7d',
  C:          '#555555',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Jupyter:    '#DA5B0B',
  Shell:      '#89e051',
}
const getLangColor = (lang) => LANG_COLORS[lang] || '#6b6b80'

export default function GitHubActivity() {
  const headRef  = useRef(null)
  const mainRef  = useRef(null)
  const headVis  = useReveal(headRef, 0.06)
  const mainVis  = useReveal(mainRef, 0.06)

  const [profile, setProfile]   = useState(null)
  const [repos, setRepos]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [activeRepo, setActive] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const [profRes, reposRes] = await Promise.all([
        fetch(GITHUB_API),
        fetch(`${GITHUB_API}/repos?sort=updated&per_page=6`),
      ])
      if (!profRes.ok || !reposRes.ok) throw new Error()
      const [prof, rps] = await Promise.all([profRes.json(), reposRes.json()])
      setProfile(prof)
      setRepos(rps)
      setActive(rps[0]?.id ?? null)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const activeRepoData = repos.find(r => r.id === activeRepo)

  return (
    <section id="github-activity">
      <div className="gh-container">

        {/* Header */}
        <div ref={headRef}>
          <div className={`gh-eyebrow${headVis ? ' vis' : ''}`}>
            <i className="fab fa-github" />
            Live GitHub Activity
          </div>
          <h2 className={`gh-title${headVis ? ' vis' : ''}`}>
            Open-Source <em>Footprint.</em>
          </h2>
          <p className={`gh-subtitle${headVis ? ' vis' : ''}`}>
            Real-time pull from GitHub API — repos and stats, live.
          </p>
        </div>

        {/* Main dashboard */}
        <div ref={mainRef} className={`gh-panel${mainVis ? ' vis' : ''}`}>

          {loading && (
            <div className="gh-loading">
              <div className="gh-spinner" />
              <span>Fetching live GitHub data…</span>
            </div>
          )}

          {error && !loading && (
            <div className="gh-error">
              <i className="fas fa-exclamation-triangle" />
              <span>Could not reach GitHub API.</span>
              <button className="gh-retry-btn" onClick={fetchData}>Retry</button>
            </div>
          )}

          {!loading && !error && profile && (
            <div className="gh-dashboard">

              {/* Profile card */}
              <ProfileCard profile={profile} />


              {/* Repos */}
              <div className="gh-repos-section">
                <div className="gh-block-title">
                  <i className="fas fa-code-branch" /> Recent Repositories
                </div>
                <div className="gh-repos-grid">
                  {repos.map((repo) => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      active={activeRepo === repo.id}
                      onSelect={() => setActive(repo.id === activeRepo ? null : repo.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Active repo detail */}
              {activeRepoData && (
                <RepoDetail repo={activeRepoData} />
              )}

            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className={`gh-footer-cta${mainVis ? ' vis' : ''}`}>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank" rel="noreferrer"
            className="gh-profile-link"
          >
            <i className="fab fa-github" />
            <span>View Full GitHub Profile</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}

/* ── Profile Card ─────────────────────────────────────────── */
function ProfileCard({ profile }) {
  const ref = useRef(null)
  useTilt({ max: 5, scale: 1.01, glare: true, maxGlare: 0.08 }, ref)

  const since = new Date(profile.created_at).getFullYear()

  return (
    <div ref={ref} className="gh-profile-card">
      <div className="gh-avatar-wrap">
        <img src={profile.avatar_url} alt={profile.name} className="gh-avatar" />
        <div className="gh-avatar-ring" />
      </div>
      <div className="gh-profile-info">
        <div className="gh-profile-name">
          {profile.name || profile.login}
          <span className="gh-profile-login">@{profile.login}</span>
        </div>
        {profile.bio && <p className="gh-profile-bio">{profile.bio}</p>}
      </div>
      <div className="gh-profile-stats">
        <div className="gh-pstat">
          <span className="gh-pstat-val">{profile.public_repos}</span>
          <span className="gh-pstat-lbl">Repos</span>
        </div>
        <div className="gh-pstat-div" />
        <div className="gh-pstat">
          <span className="gh-pstat-val">{profile.followers}</span>
          <span className="gh-pstat-lbl">Followers</span>
        </div>
        <div className="gh-pstat-div" />
        <div className="gh-pstat">
          <span className="gh-pstat-val">{profile.following}</span>
          <span className="gh-pstat-lbl">Following</span>
        </div>
        <div className="gh-pstat-div" />
        <div className="gh-pstat">
          <span className="gh-pstat-val">{since}</span>
          <span className="gh-pstat-lbl">On GitHub</span>
        </div>
      </div>
    </div>
  )
}


/* ── Repo Card ────────────────────────────────────────────── */
function RepoCard({ repo, active, onSelect }) {
  const ref = useRef(null)
  useTilt({ max: 7, scale: 1.015, glare: true, maxGlare: 0.1 }, ref)

  return (
    <div
      ref={ref}
      className={`gh-repo-card${active ? ' active' : ''}`}
      onClick={onSelect}
      style={{ '--repo-c': getLangColor(repo.language) }}
    >
      <div className="gh-repo-bar" />
      <div className="gh-repo-top">
        <i className="fas fa-code-branch gh-repo-icon" />
        <span className="gh-repo-visibility">{repo.private ? 'PRIVATE' : 'PUBLIC'}</span>
      </div>
      <h4 className="gh-repo-name">{repo.name}</h4>
      <p className="gh-repo-desc">{repo.description || 'No description provided.'}</p>
      <div className="gh-repo-foot">
        {repo.language && (
          <span className="gh-lang">
            <span className="gh-lang-dot" style={{ background: getLangColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="gh-stars"><i className="fas fa-star" /> {repo.stargazers_count}</span>
        <span className="gh-forks"><i className="fas fa-code-branch" /> {repo.forks_count}</span>
      </div>
    </div>
  )
}

/* ── Repo Detail Expanded ─────────────────────────────────── */
function RepoDetail({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <div className="gh-repo-detail">
      <div className="gh-detail-header">
        <span className="gh-detail-title">
          <i className="fas fa-folder-open" /> {repo.name}
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="gh-detail-open"
          onClick={e => e.stopPropagation()}
        >
          <i className="fas fa-external-link-alt" /> Open Repo
        </a>
      </div>
      <div className="gh-detail-meta">
        <span><i className="fas fa-clock" /> Updated {updated}</span>
        {repo.language && (
          <span>
            <span className="gh-lang-dot" style={{ background: getLangColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span><i className="fas fa-star" /> {repo.stargazers_count} stars</span>
        <span><i className="fas fa-code-branch" /> {repo.forks_count} forks</span>
        {repo.license && <span><i className="fas fa-balance-scale" /> {repo.license.spdx_id}</span>}
      </div>
      {repo.description && <p className="gh-detail-desc">{repo.description}</p>}
      {repo.topics?.length > 0 && (
        <div className="gh-detail-topics">
          {repo.topics.map(t => <span key={t} className="gh-topic">{t}</span>)}
        </div>
      )}
    </div>
  )
}
