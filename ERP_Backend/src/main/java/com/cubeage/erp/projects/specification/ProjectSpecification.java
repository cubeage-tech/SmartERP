package com.cubeage.erp.projects.specification;
import com.cubeage.erp.projects.dto.request.ProjectSearchRequest; import com.cubeage.erp.projects.entity.Project;
import org.springframework.data.jpa.domain.Specification;
public final class ProjectSpecification {
 private ProjectSpecification(){}
 public static Specification<Project> build(Long tenantId,ProjectSearchRequest r){
  return Specification.where(tenant(tenantId)).and(keyword(r.keyword())).and(status(r.status()))
   .and(manager(r.managerUserId())).and(branch(r.branchId())).and(department(r.departmentId()));
 }
 private static Specification<Project> tenant(Long v){return (root,q,cb)->cb.equal(root.get("tenantId"),v);}
 private static Specification<Project> keyword(String v){return (root,q,cb)->{if(v==null||v.isBlank())return cb.conjunction();String p="%"+v.toLowerCase()+"%";return cb.or(cb.like(cb.lower(root.get("projectCode")),p),cb.like(cb.lower(root.get("name")),p),cb.like(cb.lower(root.get("customerName")),p));};}
 private static Specification<Project> status(Object v){return (root,q,cb)->v==null?cb.conjunction():cb.equal(root.get("status"),v);}
 private static Specification<Project> manager(Long v){return (root,q,cb)->v==null?cb.conjunction():cb.equal(root.get("managerUserId"),v);}
 private static Specification<Project> branch(Long v){return (root,q,cb)->v==null?cb.conjunction():cb.equal(root.get("branchId"),v);}
 private static Specification<Project> department(Long v){return (root,q,cb)->v==null?cb.conjunction():cb.equal(root.get("departmentId"),v);}
}
