using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MorenoSeguros.Core.Exceptions;

namespace MorenoSeguros.Infrastructure.Data
{
    //TODO: Delete this repo and use from Specificacion library
    public class RepositoryBaseLocal<T> : IRepositoryBase<T> where T : class
    {
        private readonly AppDbContext dbContext;
        private readonly ISpecificationEvaluator specificationEvaluator;

        public RepositoryBaseLocal(AppDbContext dbContext)
            : this(dbContext, SpecificationEvaluator.Default)
        {
        }

        /// <inheritdoc/>
        public RepositoryBaseLocal(AppDbContext dbContext, ISpecificationEvaluator specificationEvaluator)
        {
            this.dbContext = dbContext;
            this.specificationEvaluator = specificationEvaluator;
        }

        /// <inheritdoc/>
        public virtual Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().Add(entity);

            return Task.FromResult(entity);
        }

        /// <inheritdoc/>
        public virtual Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().AddRange(entities);

            return Task.FromResult(entities);
        }

        /// <inheritdoc/>
        public virtual Task<int> UpdateAsync(T entity, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().Update(entity);

            return Task.FromResult(1);
        }

        /// <inheritdoc/>
        public virtual Task<int> UpdateRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().UpdateRange(entities);

            return Task.FromResult(entities.Count());
        }

        /// <inheritdoc/>
        public virtual Task<int> DeleteAsync(T entity, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().Remove(entity);

            return Task.FromResult(1);
        }

        /// <inheritdoc/>
        public virtual Task<int> DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            dbContext.Set<T>().RemoveRange(entities);

            return Task.FromResult(entities.Count());
        }

        /// <inheritdoc/>
        public virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await dbContext.SaveChangesAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<T?> GetByIdAsync<TId>(TId id, CancellationToken cancellationToken = default) where TId : notnull
        {
            return await dbContext.Set<T>().FindAsync(new object[] { id }, cancellationToken: cancellationToken);
        }

        /// <inheritdoc/>
        [Obsolete]
        public virtual async Task<T?> GetBySpecAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        [Obsolete]
        public virtual async Task<TResult?> GetBySpecAsync<TResult>(ISpecification<T, TResult> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<T?> FirstOrDefaultAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<TResult?> FirstOrDefaultAsync<TResult>(ISpecification<T, TResult> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<T?> SingleOrDefaultAsync(ISingleResultSpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).SingleOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<TResult?> SingleOrDefaultAsync<TResult>(ISingleResultSpecification<T, TResult> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).SingleOrDefaultAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<List<T>> ListAsync(CancellationToken cancellationToken = default)
        {
            return await dbContext.Set<T>().ToListAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<List<T>> ListAsyncAsNoTrackin(CancellationToken cancellationToken = default)
        {
            return await dbContext.Set<T>().AsNoTracking().ToListAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<List<T>> ListAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            var queryResult = await ApplySpecification(specification).ToListAsync(cancellationToken);

            return specification.PostProcessingAction == null ? queryResult : specification.PostProcessingAction(queryResult).ToList();
        }

        /// <inheritdoc/>
        public virtual async Task<List<TResult>> ListAsync<TResult>(ISpecification<T, TResult> specification, CancellationToken cancellationToken = default)
        {
            var queryResult = await ApplySpecification(specification).ToListAsync(cancellationToken);

            return specification.PostProcessingAction == null ? queryResult : specification.PostProcessingAction(queryResult).ToList();
        }

        /// <inheritdoc/>
        public virtual async Task<int> CountAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification, true).CountAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<int> CountAsync(CancellationToken cancellationToken = default)
        {
            return await dbContext.Set<T>().CountAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<bool> AnyAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification, true).AnyAsync(cancellationToken);
        }

        /// <inheritdoc/>
        public virtual async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
        {
            return await dbContext.Set<T>().AnyAsync(cancellationToken);
        }

        /// <summary>
        /// Filters the entities  of <typeparamref name="T"/>, to those that match the encapsulated query logic of the
        /// <paramref name="specification"/>.
        /// </summary>
        /// <param name="specification">The encapsulated query logic.</param>
        /// <param name="evaluateCriteriaOnly"></param>
        /// <returns>The filtered entities as an <see cref="IQueryable{T}"/>.</returns>
        protected virtual IQueryable<T> ApplySpecification(ISpecification<T> specification, bool evaluateCriteriaOnly = false)
        {
            return specificationEvaluator.GetQuery(dbContext.Set<T>().AsQueryable(), specification, evaluateCriteriaOnly);
        }

        /// <summary>
        /// Filters all entities of <typeparamref name="T" />, that matches the encapsulated query logic of the
        /// <paramref name="specification"/>, from the database.
        /// <para>
        /// Projects each entity into a new form, being <typeparamref name="TResult" />.
        /// </para>
        /// </summary>
        /// <typeparam name="TResult">The type of the value returned by the projection.</typeparam>
        /// <param name="specification">The encapsulated query logic.</param>
        /// <returns>The filtered projected entities as an <see cref="IQueryable{T}"/>.</returns>
        protected virtual IQueryable<TResult> ApplySpecification<TResult>(ISpecification<T, TResult> specification)
        {
            return specificationEvaluator.GetQuery(dbContext.Set<T>().AsQueryable(), specification);
        }

        public async Task<T> SingleOrDefaultWithErrorMessage(ISingleResultSpecification<T> specification, string entityName = "the record", CancellationToken cancellationToken = default)
        {
            var entity = await ApplySpecification(specification).SingleOrDefaultAsync(cancellationToken);
            if (entity != null)
                return entity;

            throw new NotFoundException($"Could not find {entityName}.");
        }

        public async Task<int> DeleteRangeAsync(ISpecification<T> specification, CancellationToken cancellationToken = default)
        {
            var query = ApplySpecification(specification);
            int count = query.Count();

            dbContext.Set<T>().RemoveRange(query);
            await SaveChangesAsync(cancellationToken);
            return count;
        }

        /// <inheritdoc/>
        public IAsyncEnumerable<T> AsAsyncEnumerable(ISpecification<T> specification)
        {
            return ApplySpecification(specification).AsAsyncEnumerable();
        }
    }
}
