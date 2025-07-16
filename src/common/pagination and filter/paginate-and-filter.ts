import { Model } from 'mongoose';
import { PaginationQueryDto } from './dtos/pagination-query.dto';

export async function PaginateAndFilter(
  model: Model<any>,
  query: PaginationQueryDto,
  searchableFields: string[],
) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filter,
    search,
  } = query;

  const skip = (page - 1) * limit;
  const sort: { [key: string]: 1 | -1 } = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  let filters: Record<string, any> = {};
  if (filter) {
    try {
      filters = JSON.parse(filter);
    } catch {
      throw new Error('Invalid filter format');
    }
  }

   if (search && searchableFields.length > 0) {
    filters.$or = searchableFields.map((field) => ({
      [field]: { $regex: new RegExp(search, 'i') },
    }));
  }

  const dbQuery = model.find(filters).sort(sort).skip(skip).limit(limit);

  const [items, total] = await Promise.all([
    dbQuery.exec(),
    model.countDocuments(filters),
  ]);

  return {
    data: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
